import { IEvent } from '@nestjs/cqrs';

export class NotificationFailedEvent implements IEvent {
  constructor(public readonly messageID: string) {}
}
