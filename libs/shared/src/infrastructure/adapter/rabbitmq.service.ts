import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IMessagePublisher } from '../../application/ports/message-publisher.interface';
import { Notification } from '../../domain/notification.entity';

@Injectable()
export class RabbitMQService implements IMessagePublisher {
  constructor(
    @Inject('NOTIFICATION_RABBITMQ_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  publishNotificationForProcessing(notification: Notification): void {
    const payload = {
      messageID: notification.messageID,
      content: notification.content,
    };

    this.client.emit('notification_created', payload);
  }

  publishNotificationStatus(notification: Notification): void {
    const payload = {
      messageID: notification.messageID,
      status: notification.status,
    };
    this.client.emit('queue.notification.status.manoel', payload);
  }
}
