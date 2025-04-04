import { FC, memo } from 'react';
import { mergeClasses, Tooltip } from '@fluentui/react-components';
import { Message } from '@microsoft/spark.api';

import {
  formatMessageDateTime,
  formatMessageTime,
  formatMessageTooltipTime,
} from '../../utils/date-format';

import useChatContainerClasses from './ChatMessageContainer.styles';
import ChatAvatarWrapper from './ChatAvatarWrapper';

export interface MessageProps {
  readonly value: Message;
  readonly isConnected?: boolean;
  readonly children?: React.ReactNode;
}

const ChatMessageContainer: FC<MessageProps> = memo(({ value, isConnected = false, children }) => {
  const classes = useChatContainerClasses();
  const sendDirection = value.from?.user?.id === 'devtools' ? 'sent' : 'received';
  const ariaLabel = sendDirection === 'sent' ? 'Sent message at' : 'Received message at';

  return (
    <article
      id={`chat-message-row-${value.id}`}
      className={mergeClasses(
        classes.messageRow,
        sendDirection === 'sent' ? classes.messageGroupSent : classes.messageGroupReceived
      )}
    >
      <div className={classes.messageContainer}>
        <div className={classes.badgeMessageContainer}>
          {sendDirection === 'received' && <ChatAvatarWrapper isConnected={isConnected} />}
          <div className={classes.timeMessageContainer}>
            {value.createdDateTime ? (
              <Tooltip
                content={formatMessageTooltipTime(value.createdDateTime)}
                relationship="label"
              >
                <time
                  aria-label={ariaLabel}
                  dateTime={formatMessageDateTime(value.createdDateTime)}
                  id={value.id}
                  className={mergeClasses(
                    classes.timestamp,
                    sendDirection === 'sent' && classes.sentTime
                  )}
                >
                  {formatMessageTime(value.createdDateTime)}
                </time>
              </Tooltip>
            ) : (
              <span className={classes.timestamp}>Timestamp unavailable</span>
            )}
            {children}
          </div>
        </div>
      </div>
    </article>
  );
});

ChatMessageContainer.displayName = 'ChatMessageContainer';
export default ChatMessageContainer;
