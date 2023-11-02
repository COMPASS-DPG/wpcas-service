import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SurveyCycleParameterController } from "./survey-cycle-parameter.controller";
import { SurveyCycleParameterService } from "./survey-cycle-parameter.service";

@Module({
  imports: [PrismaModule],
  controllers: [SurveyCycleParameterController],
  providers: [SurveyCycleParameterService],
  exports: [SurveyCycleParameterService],
})
export class SurveyCycleParameterModule {}
