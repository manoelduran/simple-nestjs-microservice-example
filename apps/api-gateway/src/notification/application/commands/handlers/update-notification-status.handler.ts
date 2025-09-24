import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '@app/shared';
import { UpdateNotificationStatusCommand } from '../impl/update-notification-status.command';

@CommandHandler(UpdateNotificationStatusCommand)
export class UpdateNotificationStatusHandler
  implements ICommandHandler<UpdateNotificationStatusCommand>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: INotificationRepository,
  ) {}

  async execute(command: UpdateNotificationStatusCommand): Promise<void> {
    const { messageID, status } = command;
    const notification = await this.repository.findById(messageID);

    if (notification) {
      notification.status = status;
      await this.repository.save(notification);
    }
  }
}
