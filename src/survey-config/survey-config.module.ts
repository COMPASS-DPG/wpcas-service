import { Module } from "@nestjs/common";
import { SurveyConfigService } from "./survey-config.service";
import { SurveyConfigController } from "./survey-config.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [PrismaModule],
  controllers: [SurveyConfigController],
  providers: [SurveyConfigService, PrismaService],
  exports: [SurveyConfigService],
})
export class SurveyConfigModule {}
