import { ICommand } from '@nestjs/cqrs';

export class SendNotificationCommand implements ICommand {
  constructor(
    public readonly content: string,
    public readonly messageID?: string,
  ) {}
}
