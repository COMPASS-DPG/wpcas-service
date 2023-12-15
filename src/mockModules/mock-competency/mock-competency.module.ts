import { Module } from "@nestjs/common";
import { MockCompetencyLevelService } from "../mock-competency-level/mock-competency-level.service";
import { MockCompetencyController } from "./mock-competency.controller";
import { MockCompetencyService } from "./mock-competency.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MockCompetencyController],
  providers: [MockCompetencyService, MockCompetencyLevelService],
  exports: [MockCompetencyService],
})
export class MockCompetencyModule {}
