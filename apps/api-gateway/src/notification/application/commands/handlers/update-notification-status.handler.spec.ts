/* eslint-disable @typescript-eslint/unbound-method */
import { Test, type TestingModule } from '@nestjs/testing';
import {
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
  Notification,
} from '@app/shared';
import { UpdateNotificationStatusHandler } from './update-notification-status.handler';
import { UpdateNotificationStatusCommand } from '../impl/update-notification-status.command';

const mockNotificationRepository: INotificationRepository = {
  save: jest.fn(),
  findById: jest.fn(),
};

describe('UpdateNotificationStatusHandler', () => {
  let handler: UpdateNotificationStatusHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateNotificationStatusHandler,
        {
          provide: NOTIFICATION_REPOSITORY,
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    handler = module.get<UpdateNotificationStatusHandler>(
      UpdateNotificationStatusHandler,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a notification, update its status, and save it', async () => {
    const messageID = 'test-uuid';
    const mockNotification = Notification.create('conteudo-antigo', messageID);

    (mockNotificationRepository.findById as jest.Mock).mockResolvedValue(
      mockNotification,
    );

    const command = new UpdateNotificationStatusCommand(messageID, 'Success');

    await handler.execute(command);

    expect(mockNotificationRepository.findById).toHaveBeenCalledWith(messageID);
    expect(mockNotificationRepository.save).toHaveBeenCalledTimes(1);

    expect(mockNotification.status).toEqual('Success');
    expect(mockNotificationRepository.save).toHaveBeenCalledWith(
      mockNotification,
    );
  });

  it('should do nothing if the notification is not found', async () => {
    (mockNotificationRepository.findById as jest.Mock).mockResolvedValue(null);
    const command = new UpdateNotificationStatusCommand(
      'not-found-uuid',
      'Success',
    );

    await handler.execute(command);

    expect(mockNotificationRepository.findById).toHaveBeenCalledWith(
      'not-found-uuid',
    );
    expect(mockNotificationRepository.save).not.toHaveBeenCalled();
  });
});
