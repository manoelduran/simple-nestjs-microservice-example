import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotificationSucceededEvent } from '../impl/notification-succeeded.event';
import { NotificationFailedEvent } from '../impl/notification-failed.event';
import {
  type IMessagePublisher,
  type INotificationRepository,
  MESSAGE_PUBLISHER,
  NOTIFICATION_REPOSITORY,
} from '@app/shared';

@EventsHandler(NotificationSucceededEvent, NotificationFailedEvent)
export class NotificationEventsHandler
  implements IEventHandler<NotificationSucceededEvent | NotificationFailedEvent>
{
  constructor(
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: INotificationRepository,
  ) {}

  async handle(event: NotificationSucceededEvent | NotificationFailedEvent) {
    const notification = await this.repository.findById(event.messageID);
    if (!notification) return;

    this.messagePublisher.publishNotificationStatus(notification);
  }
}
