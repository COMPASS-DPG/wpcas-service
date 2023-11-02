import { Module } from "@nestjs/common";
import { SurveyConfigService } from "./survey-config.service";
import { SurveyConfigController } from "./survey-config.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SurveyConfigController],
  providers: [SurveyConfigService],
  exports: [SurveyConfigService],
})
export class SurveyConfigModule {}
