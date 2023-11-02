import { Module } from '@nestjs/common';
import { MockCompetencyLevelController } from './mock-competency-level.controller';
import { MockCompetencyLevelService } from './mock-competency-level.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [MockCompetencyLevelController],
  providers: [MockCompetencyLevelService]
})
export class MockCompetencyLevelModule {}
