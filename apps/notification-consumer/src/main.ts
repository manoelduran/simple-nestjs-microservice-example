import { NestFactory } from '@nestjs/core';
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { NotificationConsumerModule } from './notification-consumer.module';
import { INestApplicationContext } from '@nestjs/common';

async function connectClient(app: INestApplicationContext): Promise<void> {
  const client = app.get<ClientProxy>('NOTIFICATION_STATUS_CLIENT');
  await client.connect();
  console.log('RMQ Client do Consumer está conectado');
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationConsumerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
        queue: 'queue.notification.entrance',

        queueOptions: { durable: true },
        noAck: false,
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
  );

  await app.listen();
  await connectClient(app);
  console.log('🚀 Notification Consumer está rodando e ouvindo a fila...');
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
