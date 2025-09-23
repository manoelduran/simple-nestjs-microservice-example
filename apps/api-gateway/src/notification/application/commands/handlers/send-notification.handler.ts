import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SendNotificationCommand } from '../impl/send-notification.command';
import {
  type IMessagePublisher,
  MESSAGE_PUBLISHER,
  Notification,
  NOTIFICATION_REPOSITORY,
  type INotificationRepository,
} from '@app/shared';

@CommandHandler(SendNotificationCommand)
export class SendNotificationHandler
  implements ICommandHandler<SendNotificationCommand>
{
  constructor(
    @Inject(MESSAGE_PUBLISHER)
    private readonly messagePublisher: IMessagePublisher,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: SendNotificationCommand): Promise<Notification> {
    const { content, messageID } = command;

    const notification = Notification.create(content, messageID);
    await this.notificationRepository.save(notification);

    this.messagePublisher.publishNotificationForProcessing(notification);
    return notification;
  }
}
