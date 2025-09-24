import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';

async function connectClient(app: INestApplication): Promise<void> {
  const client = app.get<ClientProxy>('NOTIFICATION_ENTRANCE_CLIENT');
  await client.connect();
  console.log('RMQ Client is connected');
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: 'queue.notification.status',
      queueOptions: { durable: true },
      noAck: false,
      exchange: 'notifications_exchange',
      exchangeType: 'topic',
      queueBindings: [
        {
          exchange: 'notifications_exchange',
          routingKey: 'notification_status_updated',
        },
      ],
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.startAllMicroservices();
  await connectClient(app);

  await app.listen(3000);
  console.log(`🚀 API Gateway está rodando na porta 3000`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
