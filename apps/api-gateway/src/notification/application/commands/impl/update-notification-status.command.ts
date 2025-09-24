import { ICommand } from '@nestjs/cqrs';
import { NotificationStatus } from '@app/shared';

export class UpdateNotificationStatusCommand implements ICommand {
  constructor(
    public readonly messageID: string,
    public readonly status: NotificationStatus,
  ) {}
}
