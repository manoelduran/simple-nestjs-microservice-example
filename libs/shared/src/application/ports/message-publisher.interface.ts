import { Notification } from '../../domain/notification.entity';

export const MESSAGE_PUBLISHER = 'MessagePublisher';

export interface IMessagePublisher {
  publishNotificationForProcessing(notification: Notification): void;
  publishNotificationStatus(notification: Notification): void;
}
