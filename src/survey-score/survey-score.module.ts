import { Module } from "@nestjs/common";
import { ResponseTrackerService } from "../response-tracker/response-tracker.service";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { QuestionBankModule } from "../question-bank/question-bank.module";
import { SurveyScoreController } from "./survey-score.controller";
import { SurveyScoreService } from "./survey-score.service";
import { PrismaModule } from "../prisma/prisma.module";


@Module({
  imports: [QuestionBankModule, PrismaModule],
  controllers: [SurveyScoreController],
  providers: [
    SurveyScoreService,
    ResponseTrackerService,
    SurveyFormService
  ],
})
export class SurveyScoreModule {}
