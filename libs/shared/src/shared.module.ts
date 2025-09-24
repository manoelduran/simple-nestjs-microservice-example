import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { MESSAGE_PUBLISHER } from './application/ports/message-publisher.interface';
import { RabbitMQService } from './infrastructure/adapter/rabbitmq.service';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATION_ENTRANCE_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
          ],
          queue: 'queue.notification.entrance',
          queueOptions: { durable: true },
          exchange: 'notifications_exchange',
          exchangeType: 'topic',
          queueBindings: [
            {
              exchange: 'notifications_exchange',
              routingKey: 'notification_created',
            },
          ],
        },
      },
      {
        name: 'NOTIFICATION_STATUS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
          ],
          queue: 'queue.notification.status',
          queueOptions: { durable: true },
          exchange: 'notifications_exchange',
          exchangeType: 'topic',
          queueBindings: [
            {
              exchange: 'notifications_exchange',
              routingKey: 'notification_status_updated',
            },
          ],
        },
      },
    ]),
  ],
  providers: [{ provide: MESSAGE_PUBLISHER, useClass: RabbitMQService }],
  exports: [CqrsModule, MESSAGE_PUBLISHER, ClientsModule],
})
export class SharedModule {}
