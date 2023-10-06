import { Test, TestingModule } from '@nestjs/testing';
import { MockUserController } from './mock-user.controller';
import { MockUserService } from './mock-user.service';

describe('MockUserController', () => {
  let controller: MockUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockUserController],
      providers: [MockUserService],
    }).compile();

    controller = module.get<MockUserController>(MockUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
