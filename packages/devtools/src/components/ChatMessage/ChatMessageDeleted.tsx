import { FC, memo, useCallback } from 'react';
import { Link, mergeClasses } from '@fluentui/react-components';

import { MessageActionUIPayload } from '../../types/MessageActionUI';

import { useChatMessageStyles } from './ChatMessage.styles';

interface ChatMessageDeletedProps {
  id: string;
  sendDirection: 'sent' | 'received';
  onMessageAction: (action: MessageActionUIPayload) => Promise<void>;
}

const ChatMessageDeleted: FC<ChatMessageDeletedProps> = memo(
  ({ id, sendDirection, onMessageAction }) => {
    const classes = useChatMessageStyles();

    const undoDelete = useCallback(async () => {
      await onMessageAction({
        id,
        type: 'messageUpdate',
        eventType: 'undeleteMessage',
      });
    }, [id, onMessageAction]);

    return (
      <div className={classes.messageContainer}>
        <div
          className={mergeClasses(
            classes.messageBody,
            sendDirection === 'sent' ? classes.sent : classes.received
          )}
        >
          <div className={classes.messageContent}>
            <div className={mergeClasses(classes.messageText, classes.messageDeleted)}>
              This message has been deleted.
              <Link as="button" className={classes.messageDeletedLink} onClick={undoDelete} inline>
                Undo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatMessageDeleted.displayName = 'ChatMessageDeleted';
export default ChatMessageDeleted;
