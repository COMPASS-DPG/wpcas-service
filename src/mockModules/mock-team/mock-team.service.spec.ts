import { Test, TestingModule } from '@nestjs/testing';
import { MockTeamService } from './mock-team.service';

describe('MockTeamService', () => {
  let service: MockTeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockTeamService],
    }).compile();

    service = module.get<MockTeamService>(MockTeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
