import { Module } from "@nestjs/common";
import { SurveyFormController } from "./survey-form.controller";
import { SurveyFormService } from "./survey-form.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  controllers: [SurveyFormController],
  providers: [SurveyFormService],
})
export class SurveyFormModule {}
