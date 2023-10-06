import { Test, TestingModule } from '@nestjs/testing';
import { MockTeamController } from './mock-team.controller';
import { MockTeamService } from './mock-team.service';

describe('MockTeamController', () => {
  let controller: MockTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockTeamController],
      providers: [MockTeamService],
    }).compile();

    controller = module.get<MockTeamController>(MockTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
