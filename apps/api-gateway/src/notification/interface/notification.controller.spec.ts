import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationDto } from './dtos/notification.dto';
import { NotificationController } from './notification.controller';

const mockCommandBus = {
  execute: jest.fn(),
};

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call commandBus.execute when sendNotification is called', async () => {
    const notificationDto: NotificationDto = {
      content: 'Test content',
    };

    mockCommandBus.execute.mockResolvedValue({ messageID: 'some-uuid' });

    await controller.sendNotification(notificationDto);

    expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
  });
});
