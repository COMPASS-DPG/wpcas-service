import { Test, TestingModule } from '@nestjs/testing';
import { MockUserService } from './mock-user.service';

describe('MockUserService', () => {
  let service: MockUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockUserService],
    }).compile();

    service = module.get<MockUserService>(MockUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
