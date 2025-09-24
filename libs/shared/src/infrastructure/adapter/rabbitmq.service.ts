import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IMessagePublisher } from '../../application/ports/message-publisher.interface';
import { Notification } from '../../domain/notification.entity';

@Injectable()
export class RabbitMQService implements IMessagePublisher {
  constructor(
    @Inject('NOTIFICATION_ENTRANCE_CLIENT')
    private readonly entranceClient: ClientProxy,

    @Inject('NOTIFICATION_STATUS_CLIENT')
    private readonly statusClient: ClientProxy,
  ) {}

  publishNotificationForProcessing(notification: Notification): void {
    const payload = {
      messageID: notification.messageID,
      content: notification.content,
    };
    this.entranceClient.emit('notification_created', payload);
  }

  publishNotificationStatus(notification: Notification): void {
    const payload = {
      messageID: notification.messageID,
      status: notification.status,
    };
    this.statusClient.emit('notification_status_updated', payload);
  }
}
