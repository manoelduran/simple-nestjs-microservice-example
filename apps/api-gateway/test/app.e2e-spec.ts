/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ApiGatewayModule } from '../src/api-gateway.module';
import {
  INotificationRepository,
  NOTIFICATION_REPOSITORY,
  SharedModule,
} from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';

describe('AppController (E2E)', () => {
  let app: INestApplication;
  let repository: INotificationRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule, SharedModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
    const client = app.get<ClientProxy>('NOTIFICATION_ENTRANCE_CLIENT');
    await client.connect();
    repository = moduleFixture.get<INotificationRepository>(
      NOTIFICATION_REPOSITORY,
    );
  }, 30000);

  afterAll(async () => {
    const client = app.get<ClientProxy>('NOTIFICATION_ENTRANCE_CLIENT');
    await client.close();
    await app.close();
  });

  it('POST /api/notificar - should accept a notification and create a record in its own database', async () => {
    const payload = {
      content: 'Hello World!',
    };

    const response = await request(app.getHttpServer())
      .post('/api/notificar')
      .send(payload)
      .expect(202);

    expect(response.body).toBeDefined();
    expect(response.body.messageID).toBeDefined();
    expect(response.body.message).toEqual(
      'Notificação recebida e sendo processada.',
    );

    const messageID = response.body.messageID;

    const savedNotification = await repository.findById(messageID);

    expect(savedNotification).not.toBeNull();
    expect(savedNotification!.messageID).toEqual(messageID);
    expect(savedNotification!.status).toEqual('Processing');

    await new Promise((resolve) => setTimeout(resolve, 5000)); // delay de 5 segundos

    const updatedNotification = await repository.findById(messageID);
    expect(updatedNotification).toBeDefined();
    expect(updatedNotification?.status).toMatch(/Success|Failure/);
  });
});
