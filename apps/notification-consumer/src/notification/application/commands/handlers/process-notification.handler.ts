import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProcessNotificationCommand } from '../impl/process-notification.command';
import {
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
  Notification,
} from '@app/shared';
import { NotificationSucceededEvent } from '../../events/impl/notification-succeeded.event';
import { NotificationFailedEvent } from '../../events/impl/notification-failed.event';

@CommandHandler(ProcessNotificationCommand)
export class ProcessNotificationHandler
  implements ICommandHandler<ProcessNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: INotificationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ProcessNotificationCommand) {
    const { messageID, content } = command;

    const notificationModel = Notification.create(content, messageID);
    await this.repository.save(notificationModel);

    const notification = this.publisher.mergeObjectContext(notificationModel);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      notification.markAsSuccess();
      notification.apply(
        new NotificationSucceededEvent(notification.messageID),
      );
    } else {
      notification.markAsFailure();
      notification.apply(new NotificationFailedEvent(notification.messageID));
    }

    await this.repository.save(notification);
    notification.commit();
  }
}
