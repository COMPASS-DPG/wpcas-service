import { Test, TestingModule } from '@nestjs/testing';
import { SurveyScoreService } from './survey-score.service';

describe('SurveyScoreService', () => {
  let service: SurveyScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyScoreService],
    }).compile();

    service = module.get<SurveyScoreService>(SurveyScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
