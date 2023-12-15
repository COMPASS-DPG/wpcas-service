import { Module } from "@nestjs/common";
import { AdminCompetencyController } from "./admin-competency.controller";
import { AdminCompetencyService } from "./admin-competency.service";
import { PrismaModule } from "../prisma/prisma.module";
import { MockCompetencyService } from "../mockModules/mock-competency/mock-competency.service";
import { MockCompetencyLevelService } from "../mockModules/mock-competency-level/mock-competency-level.service";

@Module({
  imports: [PrismaModule],
  controllers: [AdminCompetencyController],
  providers: [
    AdminCompetencyService,
    MockCompetencyService,
    MockCompetencyLevelService,
  ],
  exports: [AdminCompetencyService],
})
export class AdminCompetencyModule {}
