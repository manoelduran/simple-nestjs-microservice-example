import { Module } from '@nestjs/common';
import { SharedModule, NOTIFICATION_REPOSITORY } from '@app/shared';
import { NotificationController } from './interface/notification.controller';
import { SendNotificationHandler } from './application/commands/handlers/send-notification.handler';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { PostgresNotificationRepository } from './infrastructure/persistence/postgres-notification.repository';

@Module({
  imports: [SharedModule],
  controllers: [NotificationController],
  providers: [
    SendNotificationHandler,
    PrismaService,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PostgresNotificationRepository,
    },
  ],
})
export class NotificationModule {}
