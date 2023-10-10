import { Module } from '@nestjs/common';
import { MockCompetencyLevelController } from './mock-competency-level.controller';
import { MockCompetencyLevelService } from './mock-competency-level.service';

@Module({
  controllers: [MockCompetencyLevelController],
  providers: [MockCompetencyLevelService]
})
export class MockCompetencyLevelModule {}
