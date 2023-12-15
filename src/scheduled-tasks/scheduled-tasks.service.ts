import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SurveyConfig, SurveyStatusEnum } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { SurveyConfigService } from "../survey-config/survey-config.service";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { SurveyScoreService } from "../survey-score/survey-score.service";
import { SurveyService } from "../survey/survey.service";
import { UserMetadataService } from "../user-metadata/user-metadata.service";
import { isDayBeforeToday, isToday, isTomorrow } from "../utils/utils";
import { PassbookService } from "src/external-services/passbook/passbook.service";
import { SunbirdRcService } from "src/external-services/sunbird-rc/sunbird-rc.service";

@Injectable()
export class ScheduledTasksService {
  constructor(
    private prismaService: PrismaService,
    private surveyConfigService: SurveyConfigService,
    private surveyService: SurveyService,
    private userMetadataService: UserMetadataService,
    private surveyFormService: SurveyFormService,
    private surveyScoreService: SurveyScoreService,
    private passbookService: PassbookService,
    private sunbirdRcService: SunbirdRcService
  ) {}
  private readonly logger = new Logger(ScheduledTasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async surveyCron() {
    this.logger.log(`Start CRON Job for Surveys. Fetching data of all survey configurations.`);

    const surveyConfigs = await this.surveyConfigService.getAllSurveyConfig({});

    this.logger.log(`Fetched data of all survey configurations. Cycling through every survey configuration to start or end surveys.`);

    for (const surveyConfig of surveyConfigs) {
      this.logger.log(`Checking if the surveyConfig "${surveyConfig.surveyName}" with id: "${surveyConfig.id}" is Active.`);

      if (surveyConfig.isActive == true) {
        this.logger.log(`The survey #${surveyConfig.surveyName} is ACTIVE.`);

        if (isDayBeforeToday(surveyConfig.endTime)) {
          this.logger.log(`Survey will end tomorrow. Sending remainder notification to all survey participants.`);
          //send notifications
        } else if (isToday(surveyConfig.endTime)) {
          this.logger.log(`Fetching all SurveyForms related to the survey.`);
          const surveyForms =
            await this.surveyFormService.findSurveyFormBySurveyConfigId(
              surveyConfig.id
            );

          this.logger.log(`Calculation scores for all "${surveyForms.length}" SurveyForms related to the survey.`);
          for (const surveyForm of surveyForms) {

            this.logger.log(`Updating the surveyFrom's (id: "${surveyForm.id}") status to "CLOSED".`);
            await this.surveyFormService.updateSurveyFormStatus(
              surveyForm.id,
              SurveyStatusEnum.CLOSED
            );

            this.logger.log(`Calculating the score for SurveyForm with id: "${surveyForm.id}" for user with id: "${surveyForm.userId}".`);
            await this.surveyScoreService.calculateSurveyScoreBySurveyFormId(
              surveyForm.id
            );
            this.logger.log(`Calculated the score for SurveyForm with id: "${surveyForm.id}" for user with id: "${surveyForm.userId}".`);


            this.logger.log(`Fetching the data to create a sunbirdRC certificate.`);
            const credData = await this.surveyService.createCredentialSchemaBySurveyFormId(surveyForm.id);

            this.logger.log(`Issuing sunbirdRC credentials.`);
            let sunbirdCred : any;
            try {
              sunbirdCred = await this.sunbirdRcService.issueCredential(credData);
            } catch (error) {
              this.logger.error(error);
            }

            if(sunbirdCred){
              try {
                this.logger.log(`Credentials issued. Pushing credentials to passbook.`);
                await this.passbookService.addFeedback({
                  ...credData,
                  certificateId: sunbirdCred.id
                });
                this.logger.log(`Added credentials to passbook."`);

              } catch (error) {
                this.logger.error(error);
              }

              this.logger.log(`Updating credentials and overall score in the surveyFrom.`);
              await this.surveyFormService.updateOverallScoreAndCredentialDid(surveyForm.id, credData.overallScore, sunbirdCred.id);

            }
          }

          this.logger.log(`Deleting the userMapping for the survey as it will end today.`);
          await this.prismaService.userMapping.deleteMany({
            where: { surveyConfigId: surveyConfig.id },
          });

          this.logger.log(`Deactivating the Survey "${surveyConfig.surveyName}" as it will end today.`);
          await this.surveyConfigService.deactivateSurveyConfig(
            surveyConfig.id
          );
          this.logger.log(`The Survey "${surveyConfig.surveyName}" ends today.`);

        } else {
          this.logger.log(`The survey #"${surveyConfig.surveyName}" with surveyConfigId: "${surveyConfig.id}" is ongoing.`);
        }
      } else {
        await this.startSurvey(surveyConfig);
      }
    }
  }

  async startSurvey(surveyConfig: SurveyConfig) {
    this.logger.log(`The survey with surveyConfigId: "${surveyConfig.id}" is not ACTIVE.`);
    if (isTomorrow(surveyConfig.startTime)) {
      //update user data
      this.logger.log(`Fetching userIds of the users who are participating in the survey.`);
      const updateUsers = await this.surveyService.fetchUserIdsOfSurveyParticipants(
        surveyConfig.id
      );
      this.logger.log(`Updating all "${updateUsers.size}" user's data who are participating in the survey.`);
      for (const userId of updateUsers) {
        await this.userMetadataService.createOrUpdateUserMetadata(userId);
      }

    } else if (isToday(surveyConfig.startTime)) {

      this.logger.log(`Activating the Survey "${surveyConfig.surveyName}" with surveyConfigId: "${surveyConfig.id}".`);
      await this.surveyConfigService.updateSurveyConfigById(surveyConfig.id, {
        isActive: true,
      });

      this.logger.log(`Generating SurveyForms for every user who is participating in the Survey "${surveyConfig.surveyName}" with id: "${surveyConfig.id}".`);
      await this.surveyService.generateSurveyFormsForSurveyConfig(
        surveyConfig.id
      );
      this.logger.log(`The Survey "${surveyConfig.surveyName}" with id: "${surveyConfig.id}" has been started.`);

      // send notifications for all survey participant
      // this.logger.log(
      //   `Sending notification to every user who is participating in the Survey "${surveyConfig.surveyName}" with id: "${surveyConfig.id}".`
      // );
    } else {
      this.logger.log(`The survey with surveyConfigId: "${surveyConfig.id}" is to be Activated in the future or a dead survey.`);
    }
  }
}
