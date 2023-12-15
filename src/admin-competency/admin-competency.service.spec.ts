import { Test, TestingModule } from '@nestjs/testing';
import { AdminCompetencyService } from './admin-competency.service';

describe('AdminCompetencyService', () => {
  let service: AdminCompetencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCompetencyService],
    }).compile();

    service = module.get<AdminCompetencyService>(AdminCompetencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
