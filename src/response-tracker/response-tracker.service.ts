import { PrismaService } from "../prisma/prisma.service";
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import _ from "lodash";
import {
  CreateResponseTrackerDto,
  responseObject,
} from "./dto/create-response-tracker.dto";
import { UpdateResponseTrackerDto } from "./dto/update-response-tracker.dto";
import { IResponseTracker } from "./interfaces/response-tracker.interface";
import { ResponseTrackerStatusEnum } from "@prisma/client";
import { SurveyDataResponse } from "./dto";

@Injectable()
export class ResponseTrackerService {
  constructor(private prisma: PrismaService) {}

  public async create(createResponseTrackerDto: CreateResponseTrackerDto) {
    const responseJson = JSON.stringify(createResponseTrackerDto.responseJson);
    const payload = {
      ...createResponseTrackerDto,
      responseJson: JSON.parse(responseJson),
    };

    return await this.prisma.responseTracker.create({
      data: payload,
    });
  }

  public async findAll() {
    return await this.prisma.responseTracker.findMany();
  }

  public async findOne(id: number) {
    const response = await this.prisma.responseTracker.findUnique({
      where: { id },
    });
    if (!response)
      throw new NotFoundException(`Response tracker with id #${id} not found`);
    return response;
  }

  public async findBySurveyFormId(surveyFormId: number) {
    const response = await this.prisma.responseTracker.findMany({
      where: { surveyFormId },
    });

    if (!response || response.length === 0)
      throw new NotFoundException(
        `Response tracker with surveyFormId #${surveyFormId} not found`
      );
    return response;
  }

  public async findByAssessorId(
    assessorId: string
  ) {
    const user = await this.prisma.userMetadata.findUnique({
      where: { userId: assessorId },
    });

    if (!user) {
      throw new NotFoundException(
        `Assessor with user id #${assessorId} not found.`
      );
    }

    const response = await this.prisma.responseTracker.findMany({
      where: {
        assessorId,
        surveyForm: {
          SurveyConfig: {
            isActive: true,
          },
        },
      },
      include: {
        Assessee: {
          select: {
            designation: true,
            userName: true,
            profilePicture: true,
          },
        },
        surveyForm: {
          select: {
            SurveyConfig: {
              select: {
                endTime: true,
              },
            },
          },
        },
      },
    });

    return response;
  }

  public async findByAssesseeIdAndSurveyFormId(
    assesseeId: string,
    surveyFormId: number
  ) {
    const response = await this.prisma.responseTracker.findMany({
      where: { assesseeId, surveyFormId },
      include: {
        Assessor: {
          select: {
            designation: true,
            userName: true,
            profilePicture: true,
          },
        },
        surveyForm: {
          select: {
            SurveyConfig: {
              select: {
                endTime: true,
              },
            },
          },
        },
      },
    });

    if (!response || response.length === 0)
      throw new NotFoundException(
        `Response tracker with assesseeId #${assesseeId} and surveyFormId #${surveyFormId} not found`
      );
    return response;
  }

  public async getResponsesActiveSurveyByUserId(userId: string) {
    const surveyForms = await this.prisma.surveyForm.findMany({
      where: {
        SurveyConfig: {
          isActive: true,
        },
        userId,
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
            status: true,
            Assessor: {
              select: {
                userId: true,
                userName: true,
              },
            },
          },
        },
      },
    });
    const responses: IResponseTracker[] = surveyForms.flatMap(
      (form) => form.ResponseTracker
    );
    return responses;
  }

  public async update(
    id: number,
    updateResponseTrackerDto: UpdateResponseTrackerDto
  ) {
    const isQuestionsValid = await this.validateQuestions(
      updateResponseTrackerDto.responseJson,
      updateResponseTrackerDto.surveyFormId
    );

    if (!isQuestionsValid) {
      throw new NotAcceptableException(
        `Question not matching with the questions in the survey form with id #${updateResponseTrackerDto.surveyFormId}`
      );
    }
    const responseJson = JSON.stringify(updateResponseTrackerDto.responseJson);

    const payload = {
      ...updateResponseTrackerDto,
      responseJson: JSON.parse(responseJson || "[]"),
    };

    if (!responseJson) delete payload.responseJson;

    return await this.prisma.responseTracker.update({
      where: { id },
      data: payload,
    });
  }

  public async remove(id: number) {
    return await this.prisma.responseTracker.delete({ where: { id } });
  }

  async getAllResponseJsonBySurveyFormId(
    surveyFormId: number,
    status?: string
  ) {
    const whereClause: any = {
      surveyFormId: surveyFormId,
    };

    if (status) {
      whereClause.status = status; // Filter by status if provided
    }

    const responseTrackers = await this.prisma.responseTracker.findMany({
      where: whereClause,
      select: {
        responseJson: true,
        status: true,
        assessorId: true,
        assesseeId: true,
      },
    });

    const result = responseTrackers.map((response) => {
      const { assesseeId, assessorId, responseJson, status } = response;
      return {
        assesseeId,
        assessorId,
        status,
        responseJson: JSON.parse(JSON.stringify(responseJson) || "[]"),
      };
    });

    return result;
  }

  public async updateBySurveyFormId(
    updateResponseTrackerDto: UpdateResponseTrackerDto
  ) {
    const { surveyFormId, assesseeId, assessorId, responseJson } =
      updateResponseTrackerDto;
    const isQuestionsValid = await this.validateQuestions(
      responseJson,
      surveyFormId
    );

    if (!isQuestionsValid) {
      throw new NotAcceptableException(
        `Question not matching with the questions in the survey form with id #${surveyFormId}`
      );
    }

    const responseJsonData = JSON.stringify(responseJson);

    const payload = {
      responseJson: JSON.parse(responseJsonData || "[]"),
      status: ResponseTrackerStatusEnum.COMPLETED,
    };

    if (!responseJsonData) delete payload.responseJson;

    const today = new Date().toISOString();

    return await this.prisma.responseTracker.update({
      where: {
        surveyFormId_assesseeId_assessorId: {
          surveyFormId,
          assesseeId,
          assessorId,
        },
        surveyForm: {
          SurveyConfig: {
            endTime: {
              gte: today,
            },
          },
        },
      },
      data: payload,
    });
  }

  public async validateQuestions(
    questionData: responseObject[],
    surveyFormId: number
  ): Promise<boolean> {
    const surveyForm = await this.prisma.surveyForm.findUniqueOrThrow({
      where: {
        id: surveyFormId,
      },
    });

    const surveyFormQuestions = JSON.parse(
      JSON.stringify(_.get(surveyForm, "questionsJson", []))
    );
    let surveyFormQuestionIds = _.compact(
      _.map(surveyFormQuestions, (question) =>
        _.get(question, "questionId", null)
      )
    );

    surveyFormQuestionIds = _.sortBy(surveyFormQuestionIds);

    let questionIds = _.compact(
      _.map(questionData, (question) => _.get(question, "questionId", null))
    );

    questionIds = _.sortBy(questionIds);
    return _.isEqual(questionIds, surveyFormQuestionIds);
  }

  async fetchActiveSurveyFormData(): Promise<SurveyDataResponse> {
    const isActiveSurveyCondition = {
      surveyForm: {
        SurveyConfig: {
          isActive: true,
        },
      },
    };

    const totalSurveys = await this.getCountByStatus(isActiveSurveyCondition);

    const totalSurveysToBeFilled = await this.getCountByStatus({
      ...isActiveSurveyCondition,
      status: ResponseTrackerStatusEnum.PENDING,
    });

    const totalSurveysFilled = await this.getCountByStatus({
      ...isActiveSurveyCondition,
      status: ResponseTrackerStatusEnum.COMPLETED,
    });

    return { totalSurveys, totalSurveysFilled, totalSurveysToBeFilled };
  }

  async getCountByStatus(whereCondition): Promise<number> {
    return await this.prisma.responseTracker.count({
      where: whereCondition,
    });
  }
}
