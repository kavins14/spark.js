import {
  Activity,
  ActivityLike,
  SentActivity,
  cardAttachment,
  ConversationAccount,
  ConversationReference,
  InvokeResponse,
  MessageActivity,
  MessageDeleteActivity,
  MessageUpdateActivity,
  toActivityParams,
  TokenExchangeResource,
  TokenExchangeState,
  TokenPostResource,
  TypingActivity,
} from '@microsoft/spark.api';
import { ILogger } from '@microsoft/spark.common/logging';
import { IStorage } from '@microsoft/spark.common/storage';

import { ApiClient } from '../api';
import { ISender, IStreamer } from '../types';

export interface IActivityContextOptions<T extends Activity = Activity> {
  /**
   * the app id of the bot
   */
  appId: string;

  /**
   * the inbound activity
   */
  activity: T;

  /**
   * the inbound activity conversation reference
   */
  ref: ConversationReference;

  /**
   * the app logger instance
   */
  log: ILogger;

  /**
   * the api client
   */
  api: ApiClient;

  /**
   * app storage instance
   */
  storage: IStorage;

  /**
   * whether the user has provided
   * their MSGraph credentials for use
   * via `api.user.*`
   */
  isSignedIn?: boolean;

  /**
   * extra data
   */
  [key: string]: any;

  /**
   * call the next event/middleware handler
   */
  next: (context?: IActivityContext) => (void | InvokeResponse) | Promise<void | InvokeResponse>;
}

type SignInOptions = {
  /**
   * The name of the auth connection to use
   * @default `graph`
   */
  connectionName: string;
  /**
   * The text to display on the oauth card
   * @default `Please Sign In...`
   */
  oauthCardText: string;
  /**
   * The text to display on the sign in button
   * @default `Sign In`
   */
  signInButtonText: string;
  /**
   * Construct your own sign in activity
   * By default, we create a simple oauth card with a sign in button.
   * Only use this if you need to fully customize the sign in experience.
   */
  overrideSignInActivity?: (
    tokenExchangeResource?: TokenExchangeResource,
    tokenPostResource?: TokenPostResource,
    signInLink?: string
  ) => ActivityLike;
};

export interface IActivityContext<T extends Activity = Activity>
  extends IActivityContextOptions<T> {
  /**
   * a stream that can emit activity chunks
   */
  stream: IStreamer;

  /**
   * send an activity to the conversation
   * @param activity activity to send
   */
  send: (activity: ActivityLike) => Promise<SentActivity>;

  /**
   * reply to the inbound activity
   * @param activity activity to send
   */
  reply: (activity: ActivityLike) => Promise<SentActivity>;

  /**
   * trigger user signin flow for the activity sender
   * @param options options for the signin flow
   */
  signin: (options?: Partial<SignInOptions>) => Promise<string | undefined>;

  /**
   * sign the activity sender out
   * @param name auth connection name, defaults to `graph`
   */
  signout: (name?: string) => Promise<void>;
}

const DEFAULT_SIGNIN_OPTIONS: SignInOptions = {
  connectionName: 'graph',
  oauthCardText: 'Please Sign In...',
  signInButtonText: 'Sign In',
};

export class ActivityContext<T extends Activity = Activity> implements IActivityContext<T> {
  appId!: string;
  activity!: T;
  ref!: ConversationReference;
  log!: ILogger;
  api!: ApiClient;
  storage!: IStorage;
  stream: IStreamer;
  isSignedIn?: boolean;
  next!: (context?: IActivityContext) => (void | InvokeResponse) | Promise<void | InvokeResponse>;
  [key: string]: any;

  protected _plugin: ISender;
  protected _next?: (
    context?: IActivityContext
  ) => (void | InvokeResponse) | Promise<void | InvokeResponse>;

  constructor(plugin: ISender, value: IActivityContextOptions) {
    Object.assign(this, value);
    this._plugin = plugin;
    this.stream = plugin.createStream(value.ref);

    if (value.activity.type === 'message') {
      value.activity = MessageActivity.from(value.activity).toInterface();
    }

    if (value.activity.type === 'messageUpdate') {
      value.activity = MessageUpdateActivity.from(value.activity).toInterface();
    }

    if (value.activity.type === 'messageDelete') {
      value.activity = MessageDeleteActivity.from(value.activity).toInterface();
    }

    if (value.activity.type === 'typing') {
      value.activity = TypingActivity.from(value.activity).toInterface();
    }
  }

  async send(activity: ActivityLike) {
    return await this._plugin.send(toActivityParams(activity), this.ref);
  }

  async reply(activity: ActivityLike) {
    activity = toActivityParams(activity);
    activity.replyToId = this.activity.id;
    return this.send(activity);
  }

  async signin(options?: Partial<SignInOptions>) {
    const { connectionName, oauthCardText, signInButtonText, overrideSignInActivity } = {
      ...DEFAULT_SIGNIN_OPTIONS,
      ...options,
    };

    const convo = { ...this.ref };

    try {
      const res = await this.api.users.token.get({
        channelId: this.activity.channelId,
        userId: this.activity.from.id,
        connectionName,
      });

      return res.token;
    } catch (err) {
      // noop
    }

    // create new 1:1 conversation with user to do SSO
    // because groupchats don't support it.
    if (this.activity.conversation.isGroup) {
      const res = await this.api.conversations.create({
        tenantId: this.activity.conversation.tenantId,
        isGroup: false,
        bot: { id: this.activity.recipient.id },
        members: [this.activity.from],
      });

      await this.send({ type: 'message', text: oauthCardText });
      convo.conversation = { id: res.id } as ConversationAccount;
    }

    const tokenExchangeState: TokenExchangeState = {
      connectionName,
      conversation: convo,
      relatesTo: this.activity.relatesTo,
      msAppId: this.appId,
    };

    const state = Buffer.from(JSON.stringify(tokenExchangeState)).toString('base64');
    const resource = await this.api.bots.signIn.getResource({ state });

    await this.send(
      overrideSignInActivity?.(
        resource.tokenExchangeResource,
        resource.tokenPostResource,
        resource.signInLink
      ) ?? {
        type: 'message',
        inputHint: 'acceptingInput',
        recipient: this.activity.from,
        attachments: [
          cardAttachment('oauth', {
            text: oauthCardText,
            connectionName,
            tokenExchangeResource: resource.tokenExchangeResource,
            tokenPostResource: resource.tokenPostResource,
            buttons: [
              {
                type: 'signin',
                title: signInButtonText,
                value: resource.signInLink,
              },
            ],
          }),
        ],
      }
    );
  }

  async signout(name = 'graph') {
    await this.api.users.token.signOut({
      channelId: this.activity.channelId,
      userId: this.activity.from.id,
      connectionName: name,
    });
  }

  toInterface(): IActivityContext {
    return {
      activity: this.activity,
      api: this.api,
      appId: this.appId,
      log: this.log,
      ref: this.ref,
      storage: this.storage,
      stream: this.stream,
      isSignedIn: this.isSignedIn,
      next: this.next.bind(this),
      reply: this.reply.bind(this),
      send: this.send.bind(this),
      signin: this.signin.bind(this),
      signout: this.signout.bind(this),
    };
  }
}
