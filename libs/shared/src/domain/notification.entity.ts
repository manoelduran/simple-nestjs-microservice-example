import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

export type NotificationStatus = 'Processing' | 'Success' | 'Failure';

export class Notification extends AggregateRoot {
  readonly messageID: string;
  readonly content: string;
  public status: NotificationStatus;

  private constructor(messageID: string, content: string) {
    super();
    this.messageID = messageID;
    this.content = content;
    this.status = 'Processing';
  }

  public static create(
    content: string,
    messageID: string = uuidv4(),
  ): Notification {
    return new Notification(messageID, content);
  }

  public markAsSuccess() {
    this.status = 'Success';
  }

  public markAsFailure() {
    this.status = 'Failure';
  }
}
