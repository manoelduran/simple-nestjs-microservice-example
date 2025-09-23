import { IEvent } from '@nestjs/cqrs';

export class NotificationSucceededEvent implements IEvent {
  constructor(public readonly messageID: string) {}
}
