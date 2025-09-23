import { Module } from '@nestjs/common';
import { SharedModule, NOTIFICATION_REPOSITORY } from '@app/shared';
import { NotificationHandler } from './interface/notification.handler';
import { ProcessNotificationHandler } from './application/commands/handlers/process-notification.handler';
import { NotificationEventsHandler } from './application/events/handlers/notification.events.handler';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { PostgresNotificationRepository } from './infrastructure/persistence/postgres-notification.repository';

@Module({
  imports: [SharedModule],
  controllers: [NotificationHandler],
  providers: [
    ProcessNotificationHandler,
    NotificationEventsHandler,
    PrismaService,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: PostgresNotificationRepository,
    },
  ],
})
export class NotificationModule {}
