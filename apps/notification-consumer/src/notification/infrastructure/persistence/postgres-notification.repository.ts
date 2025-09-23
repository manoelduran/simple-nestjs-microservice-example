/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import {
  type INotificationRepository,
  Notification,
  NotificationStatus,
} from '@app/shared';
import { PrismaService } from './prisma.service';

@Injectable()
export class PostgresNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(messageID: string): Promise<Notification | null> {
    const raw = await this.prisma.notification.findUnique({
      where: { messageID },
    });
    if (!raw) return null;

    const notification = Notification.create(raw.content, raw.messageID);
    notification.status = raw.status as NotificationStatus;
    return notification;
  }

  async save(notification: Notification): Promise<void> {
    await this.prisma.notification.upsert({
      where: { messageID: notification.messageID },
      update: { status: notification.status, content: notification.content },
      create: {
        messageID: notification.messageID,
        content: notification.content,
        status: notification.status,
      },
    });
  }
}
