import { Test, TestingModule } from '@nestjs/testing';
import { ResponseTrackerService } from './response-tracker.service';

describe('ResponseTrackerService', () => {
  let service: ResponseTrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseTrackerService],
    }).compile();

    service = module.get<ResponseTrackerService>(ResponseTrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
