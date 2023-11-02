import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateResponseTrackerDto } from "./dto/create-response-tracker.dto";
import { UpdateResponseTrackerDto } from "./dto/update-response-tracker.dto";
import { IResponseTracker } from "./interfaces/response-tracker.interface";

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
      throw new NotFoundException(`Response tracer with id #${id} not found`);
    return response;
  }

  public async findBySurveyFormId(surveyFormId: number) {
    const response = await this.prisma.responseTracker.findMany({
      where: { surveyFormId },
    });

    if (!response || response.length === 0)
      throw new NotFoundException(
        `Response tracer with surveyFormId #${surveyFormId} not found`
      );
    return response;
  }

  public async findByAssessorId(assessorId: string) {
    const response = await this.prisma.responseTracker.findMany({
      where: { assessorId },
    });

    if (!response || response.length === 0)
      throw new NotFoundException(
        `Response tracer with assessorId #${assessorId} not found`
      );
    return response;
  }

  public async findByAssesseeId(assesseeId: string) {
    const response = await this.prisma.responseTracker.findMany({
      where: { assesseeId },
    });

    if (!response || response.length === 0)
      throw new NotFoundException(
        `Response tracer with assesseeId #${assesseeId} not found`
      );
    return response;
  }

  public async getResponsesActiveSurveyByUserId(userId: string) {
    const surveyForms = await this.prisma.surveyForm.findMany({
      where: {
        surveyCycleParameter: {
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
}
