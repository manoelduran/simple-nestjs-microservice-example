import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { ClientProxy } from '@nestjs/microservices';
import { INestApplication } from '@nestjs/common';

async function connectClient(app: INestApplication): Promise<void> {
  const client = app.get<ClientProxy>('NOTIFICATION_RABBITMQ_CLIENT');
  await client.connect();
  console.log('RMQ Client is connected');
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await connectClient(app);

  await app.listen(3000);
  console.log(`🚀 API Gateway está rodando na porta 3000`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
