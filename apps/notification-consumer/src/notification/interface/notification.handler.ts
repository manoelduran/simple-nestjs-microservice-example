import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProcessNotificationCommand } from '../application/commands/impl/process-notification.command';

@Controller()
export class NotificationHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern('notification_created')
  async handleNotification(
    @Payload() data: { messageID: string; content: string },
  ): Promise<void> {
    await this.commandBus.execute(
      new ProcessNotificationCommand(data.messageID, data.content),
    );
  }
}
