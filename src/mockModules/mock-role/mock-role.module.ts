import { Module } from '@nestjs/common';
import { MockRoleController } from './mock-role.controller';
import { MockRoleService } from './mock-role.service';
import { MockCompetencyService } from '../mock-competency/mock-competency.service';
import { MockCompetencyLevelService } from '../mock-competency-level/mock-competency-level.service';

@Module({
  controllers: [MockRoleController],
  providers: [MockRoleService, MockCompetencyService, MockCompetencyLevelService]
})
export class MockRoleModule {}
