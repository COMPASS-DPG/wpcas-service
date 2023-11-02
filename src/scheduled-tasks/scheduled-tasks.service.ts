import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  AdminDepartment,
  SurveyConfig,
  SurveyStatusEnum,
} from "@prisma/client";
import { SurveyConfigService } from "../survey-config/survey-config.service";
import { SurveyCycleParameterService } from "../survey-cycle-parameter/survey-cycle-parameter.service";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { SurveyScoreService } from "../survey-score/survey-score.service";
import { SurveyService } from "../survey/survey.service";
import { UserMetadataService } from "../user-metadata/user-metadata.service";
import { AdminDepartmentService } from "../admin-department/admin-department.service";

@Injectable()
export class ScheduledTasksService {
  constructor(
    private adminDepartmentService: AdminDepartmentService,
    private surveyConfigService: SurveyConfigService,
    private surveyParamsService: SurveyCycleParameterService,
    private surveyService: SurveyService,
    private userMetadataService: UserMetadataService,
    private surveyFormService: SurveyFormService,
    private surveyScoreService: SurveyScoreService
  ) {}
  private readonly logger = new Logger(ScheduledTasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async surveyCron() {
    this.logger.log(
      `Start CRON Job for Surveys. Fetching data of all departments.`
    );

    const departments = await this.adminDepartmentService.getAllAdminDepartment({});

    this.logger.log(
      `Fetched data of all departments. Cycling through every department to start or end surveys.`
    );

    for (const department of departments) {
      const surveyConfig = await this.surveyConfigService.getAllSurveyConfig({
        departmentId: department.id,
      });

      const surveyConfigParam = await this.surveyParamsService.getAllSurveyParameter({
        surveyConfigId: surveyConfig[0].id,
      });

      this.logger.log(
        `Checking if a survey is Active for the department "${department.name}" with id: "${department.departmentId}".`
      );

      if (surveyConfigParam && surveyConfigParam[0].isActive == true) {

        this.logger.log(`A survey is ACTIVE for department "${department.name}"`);

        if (this.isDayBeforeToday(surveyConfigParam[0].endTime)) {
          this.logger.log(
            `Survey will end tomorrow. Sending remainder notification to all survey participants.`
          );
          //send notifications
        } else if (this.isToday(surveyConfigParam[0].endTime)) {
          
          this.logger.log(`Fetching all SurveyForms related to the survey.`);
          const surveyForms =
            await this.surveyFormService.findSurveyFormBySurveyCycleParameterId(
              surveyConfigParam[0].id
            );

          this.logger.log(`Calculation scores for all "${surveyForms.length}" SurveyForms related to the survey.`);
          for (const surveyForm of surveyForms) {
            //calculate score for each form
            this.logger.log(`Calculation score for SurveyForms with id: "${surveyForm.id}" for user with id: "${surveyForm.userId}".`);
            await this.surveyScoreService.calculateSurveyScoreBySurveyFormId(
              surveyForm.id
            );

            //update the survey form as "CLOSED"
            this.logger.log(`Calculated the score and updating the surveyFrom's status to "CLOSED."`);
            await this.surveyFormService.updateSurveyFormStatus(
              surveyForm.id,
              SurveyStatusEnum.CLOSED
            );
            this.logger.log(`Updated the surveyFrom's status to "CLOSED."`);
          }

          this.logger.log(`Deactivating the Survey as it will end today.`);
          await this.surveyParamsService.updateSurveyParameterById(
            surveyConfigParam[0].id,
            { isActive: false }
          );
          this.logger.log(`Deactivated the Survey with for the department "${department.name}" with id: "${department.departmentId}.`);

        }
      } else {
        await this.startSurvey(department, surveyConfig[0]);
      }
    }
  }

  async startSurvey(department: AdminDepartment, surveyConfig: SurveyConfig) {
    this.logger.log(`No survey is ACTIVE for department "${department.name}"`);
    if (this.isDayBeforeToday(surveyConfig.startTime)) {
      //update department data
      this.logger.log(`The survey starts tomorrow. Updating department data.`);
      const updateDepartment =
        await this.adminDepartmentService.createOrUpdateAdminDepartment(
          department.id
        );
      this.logger.log(`Updated department's data.`);

      //update user data
      this.logger.log(`Fetching users that belong to "${department.name}" department.`);
      const updateUsers = await this.userMetadataService.findManyUserMetadata({
        departmentId: department.id,
      });
      this.logger.log(`Updating all "${updateUsers.length}" user's data that belongs to the department "${department.name}".`);
      for (const user of updateUsers) {
        await this.userMetadataService.createOrUpdateUserMetadata(user.userId);
      }
      this.logger.log(`Updated all "${updateUsers.length}" user's data that belongs to the department "${department.name}".`);
    } else if (this.isToday(surveyConfig.startTime)) {
      this.logger.log(`The survey starts today.`);
      const surveyConfigParam =
        await this.surveyParamsService.getAllSurveyParameter({
          surveyConfigId: surveyConfig.id,
        });

      this.logger.log(`Activating the Survey with for the department "${department.name}" with id: "${department.departmentId}.`);
      if (surveyConfigParam) {
        await this.surveyParamsService.updateSurveyParameterById(
          surveyConfigParam[0].id,
          { isActive: false }
        );
      }

      this.logger.log(`Generating SurveyForms for every user that belongs to the department "${department.name}".`);
      await this.surveyService.generateSurveyFormsForDepartment(department.id);

      // send notifications for all survey participant
      this.logger.log(`Sending notification to every user that belongs to the department "${department.name}".`);
    }
  }

  isDayBeforeToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.getTime() === today.getTime();
  }

  isToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const givenDate = new Date(date);

    return givenDate.getTime() === today.getTime();
  }
}
