import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { ResponseTrackerStatusEnum, SurveyStatusEnum } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateSurveyFormDto,
  ResponseSurveyFormDto,
} from "src/survey-form/dto";
import { SurveyFormService } from "src/survey-form/survey-form.service";
import { QuestionBankService } from "../question-bank/question-bank.service";
import _ from "lodash";
import { UserMetadataService } from "../user-metadata/user-metadata.service";
import { ResponseTrackerService } from "../response-tracker/response-tracker.service";
import { HomeScreenResponse } from "./dto";

@Injectable()
export class SurveyService {
  constructor(
    private prisma: PrismaService,
    private surveyForm: SurveyFormService,
    private questionBank: QuestionBankService,
    @Inject(forwardRef(()=>UserMetadataService))
    private userMetadata: UserMetadataService,
    private responseTracker: ResponseTrackerService
  ) {}

  async getSurveysToBeFilledByUser(userId: string) {
    const responseCount = await this.prisma.responseTracker.findMany({
      where: {
        assessorId: userId,
        status: ResponseTrackerStatusEnum.PENDING,
        surveyForm: {
          SurveyConfig: {
            isActive: true,
          },
        },
      },
    });
    if (!responseCount) {
      return 0;
    }
    return responseCount.length;
  }

  async getSurveysFilledByUser(userId: string) {
    const responseCount = await this.prisma.responseTracker.findMany({
      where: {
        assessorId: userId,
        status: ResponseTrackerStatusEnum.COMPLETED,
        surveyForm: {
          SurveyConfig: {
            isActive: true,
          },
        },
      },
    });
    if (!responseCount) {
      return 0;
    }
    return responseCount.length;
  }

  async getLatestSurveyResponsesForUserId(userId: string) {
    const responses = await this.prisma.surveyForm.findFirst({
      where: {
        userId,
        SurveyConfig: {
          isActive: true,
        },
        ResponseTracker: {
          every: {
            assesseeId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        ResponseTracker: {
          select: {
            id: true,
            surveyFormId: true,
            assesseeId: true,
            Assessor: {
              select: {
                userId: true,
                userName: true,
                designation: true,
              },
            },
            status: true,
          },
        },
      },
    });
    if (!responses) {
      throw new NotFoundException(
        `For the user with id #${userId} either no responses found or no survey is active for their department.`
      );
    }
    return responses;
  }

  async generateSurveyFormsForSurveyConfig(configId: number) {
    let surveyForms: ResponseSurveyFormDto[] = [];

    //logic to fetch user mapping
    const userMapping = await this.prisma.userMapping.findMany({
      where: {
        surveyConfigId: configId,
      },
    });
    if (_.isUndefined(userMapping) || _.isEmpty(userMapping)) {
      throw new NotFoundException(
        `No user mapping found for Survey Ci=onfig with id ${configId}`
      );
    }

    for (const mapping of userMapping) {
      //get questions for the user according to their designation
      const questions = await this.questionBank.getAllQuestionsForUser(
        mapping.assesseeId
      );
      //create the CreateSurveyFormDto for the user
      const surveyFormDto: CreateSurveyFormDto = {
        userId: mapping.assesseeId,
        surveyConfigId: configId,
        status: SurveyStatusEnum.PUBLISHED,
        questionsJson: questions,
      };
      const surveyForm = await this.surveyForm.createSurveyForm(surveyFormDto);
      surveyForms.push(surveyForm);
      for (const assessor of mapping.assessorIds) {
        if (mapping.assesseeId !== assessor) {
          await this.prisma.responseTracker.create({
            data: {
              surveyFormId: surveyForm.id,
              assesseeId: mapping.assesseeId,
              assessorId: assessor,
              status: ResponseTrackerStatusEnum.PENDING,
            },
          });
        }
      }
    }
    return surveyForms;
  }

  public async fetchUserIdsOfSurveyParticipants(surveyConfigId: number): Promise<Set<string>> {
    try {
      let userIdList: Set<string> = new Set();
      const userMappings = await this.prisma.userMapping.findMany({
        where: { surveyConfigId },
      });
      for(const userMapping of userMappings){
        const userValidationArray = [...new Set([...userMapping.assessorIds, userMapping.assesseeId])];
        userIdList = new Set([...userIdList, ...userValidationArray]);
      }
      return userIdList;
    } catch (error) {
      throw error;
    }
  }

  public async wpcasHomeScreenApi(): Promise<HomeScreenResponse>{
    try {
      const users = await this.userMetadata.findManyUserMetadata({});
      const surveyData = await this.responseTracker.fetchActiveSurveyFormData();
      return {users, surveyData};
    } catch (error) {
      throw error;
    }
  }
}
