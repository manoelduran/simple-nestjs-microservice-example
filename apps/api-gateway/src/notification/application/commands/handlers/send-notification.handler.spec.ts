/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing';
import { SendNotificationHandler } from './send-notification.handler';
import { SendNotificationCommand } from '../impl/send-notification.command';
import {
  type IMessagePublisher,
  MESSAGE_PUBLISHER,
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
  Notification,
} from '@app/shared';

const mockMessagePublisher: IMessagePublisher = {
  publishNotificationForProcessing: jest.fn(),
  publishNotificationStatus: jest.fn(),
};

const mockNotificationRepository: INotificationRepository = {
  save: jest.fn(),
  findById: jest.fn(),
};

describe('SendNotificationHandler', () => {
  let handler: SendNotificationHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendNotificationHandler,
        {
          provide: MESSAGE_PUBLISHER,
          useValue: mockMessagePublisher,
        },
        {
          provide: NOTIFICATION_REPOSITORY,
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    handler = module.get<SendNotificationHandler>(SendNotificationHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a notification, save it, and publish an event', async () => {
    const command = new SendNotificationCommand(
      'Este é um conteúdo de teste',
      'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    );

    const result = await handler.execute(command);

    expect(mockNotificationRepository.save).toHaveBeenCalledTimes(1);

    expect(
      mockMessagePublisher.publishNotificationForProcessing,
    ).toHaveBeenCalledTimes(1);

    expect(mockNotificationRepository.save).toHaveBeenCalledWith(
      expect.any(Notification),
    );

    expect(result).toBeInstanceOf(Notification);

    expect(result.content).toEqual(command.content);
  });
});
