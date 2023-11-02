import { Module } from "@nestjs/common";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { QuestionBankModule } from "../question-bank/question-bank.module";
import { SurveyFormModule } from "../survey-form/survey-form.module";
import { SurveyController } from "./survey.controller";
import { SurveyService } from "./survey.service";
import { PrismaModule } from "../prisma/prisma.module";


@Module({
  imports: [PrismaModule, QuestionBankModule, SurveyFormModule],
  controllers: [SurveyController],
  providers: [SurveyService, SurveyFormService]
})
export class SurveyModule {}
