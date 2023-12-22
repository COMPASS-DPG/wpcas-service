import { Module } from "@nestjs/common";
import { QuestionBankModule } from "../question-bank/question-bank.module";
import { ResponseTrackerService } from "../response-tracker/response-tracker.service";
import { SurveyConfigModule } from "../survey-config/survey-config.module";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { SurveyScoreService } from "../survey-score/survey-score.service";
import { SurveyService } from "../survey/survey.service";
import { UserMetadataModule } from "../user-metadata/user-metadata.module";
import { ScheduledTasksService } from "./scheduled-tasks.service";
import { PrismaService } from "../prisma/prisma.service";
import { AdminCompetencyModule } from "src/admin-competency/admin-competency.module";
import { SunbirdRcModule } from "src/external-services/sunbird-rc/sunbird-rc.module";
import { PassbookModule } from "src/external-services/passbook/passbook.module";
import { ScheduledTaskController } from "./scheduled-tasks.controller";

@Module({
  imports: [
    QuestionBankModule,
    UserMetadataModule,
    SurveyConfigModule,
    AdminCompetencyModule,
    SunbirdRcModule,
    PassbookModule,
  ],
  providers: [
    ScheduledTasksService,
    SurveyFormService,
    SurveyService,
    SurveyScoreService,
    ResponseTrackerService,
    PrismaService,
  ],
  controllers: [ScheduledTaskController],
})
export class ScheduledTasksModule {}
