import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationDto } from './dtos/notification.dto';
import { SendNotificationCommand } from '../application/commands/impl/send-notification.command';

@Controller('api')
export class NotificationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('notificar')
  @HttpCode(HttpStatus.ACCEPTED)
  async sendNotification(@Body() notificationDto: NotificationDto) {
    const { content, messageID } = notificationDto;
    const command = new SendNotificationCommand(content, messageID);
    const result: { messageID: string } =
      await this.commandBus.execute(command);
    return {
      messageID: result.messageID,
      message: 'Notificação recebida e sendo processada.',
    };
  }
}
