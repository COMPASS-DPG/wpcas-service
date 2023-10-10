import { Module } from "@nestjs/common";
import { MockRoleModule } from "./mock-role/mock-role.module";
import { MockCompetencyModule } from "./mock-competency/mock-competency.module";
import { MockCompetencyLevelModule } from "./mock-competency-level/mock-competency-level.module";
import { RouterModule } from "@nestjs/core";
import { MockUserModule } from "./mock-user/mock-user.module";
import { MockLevelModule } from "./mock-level/mock-level.module";
import { MockTeamModule } from "./mock-team/mock-team.module";

@Module({
  imports: [
    MockRoleModule,
    MockCompetencyModule,
    MockCompetencyLevelModule,
    MockUserModule,
    MockLevelModule,
    MockTeamModule,
    RouterModule.register([
      { path: "mockUserService/", module: MockRoleModule },
      { path: "mockUserService/", module: MockCompetencyModule },
      { path: "mockUserService/", module: MockCompetencyLevelModule },
      { path: "mockUserService/", module: MockUserModule },
      { path: "mockUserService/", module: MockLevelModule },
      { path: "mockUserService/", module: MockTeamModule },
    ]),
  ],
})
export class MockModule {}
