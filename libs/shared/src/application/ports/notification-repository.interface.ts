import { Notification } from '../../domain/notification.entity';

export const NOTIFICATION_REPOSITORY = 'NotificationRepository';

export interface INotificationRepository {
  save(notification: Notification): Promise<void>;
  findById(messageID: string): Promise<Notification | null>;
}
