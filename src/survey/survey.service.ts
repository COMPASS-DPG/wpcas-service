import { Injectable, NotFoundException } from "@nestjs/common";
import { ResponseTrackerStatusEnum, SurveyStatusEnum } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateSurveyFormDto,
  ResponseSurveyFormDto,
} from "src/survey-form/dto";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { QuestionBankService } from "../question-bank/question-bank.service";

@Injectable()
export class SurveyService {
  constructor(
    private prisma: PrismaService,
    private surveyForm: SurveyFormService,
    private questionBank: QuestionBankService
  ) {}

  async getSurveysToBeFilledByUser(userId: string) {
    const responseCount = await this.prisma.surveyForm.findFirst({
      where: {
        userId,
        surveyCycleParameter: {
          isActive: true,
        },
        ResponseTracker: {
          every: {
            assessorId: userId,
            status: ResponseTrackerStatusEnum.PENDING,
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
            status: true,
          },
        },
      },
    });
    if (!responseCount) {
      return 0;
    }
    return responseCount.ResponseTracker.length;
  }

  async getLatestSurveyResponsesForUserId(userId: string) {
    const responses = await this.prisma.surveyForm.findFirst({
      where: {
        userId,
        surveyCycleParameter: {
          isActive: true,
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
            assessorId: true,
            responseJson: true,
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

  async generateSurveyFormsForDepartment(departmentId: number) {
    let surveyForms: ResponseSurveyFormDto[] = [];
    const users = await this.prisma.userMetadata.findMany({
      where: {
        departmentId,
      },
    });
    for (const user of users) {
      //get questions for the user according to their designation
      const questions = await this.questionBank.getAllQuestionsForUser(user.userId);
      //create the CreateSurveyFormDto for the user
      const surveyFormDto: CreateSurveyFormDto = {
        userId: user.userId,
        surveyCycleParameterId: 1,
        status: SurveyStatusEnum.PUBLISHED,
        questionsJson: questions,
      };
      const surveyForm = await this.surveyForm.createSurveyForm(surveyFormDto);
      surveyForms.push(surveyForm);
      for (const assessor of users) {
        if (user.userId !== assessor.userId) {
          await this.prisma.responseTracker.create({
            data: {
              surveyFormId: surveyForm.id,
              assesseeId: user.userId,
              assessorId: assessor.userId,
              status: ResponseTrackerStatusEnum.PENDING,
            },
          });
        }
      }
    }
    return surveyForms;
  }
}
