import { ICommand } from '@nestjs/cqrs';

export class ProcessNotificationCommand implements ICommand {
  constructor(
    public readonly messageID: string,
    public readonly content: string,
  ) {}
}
