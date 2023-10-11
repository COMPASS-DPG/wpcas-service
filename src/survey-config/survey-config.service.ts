import { Injectable, NotFoundException, Query, Res } from "@nestjs/common";
import {
  CreateSurveyConfigDto,
  SurveyConfigFilterDto,
} from "./dto/create-survey-config.dto";
import { UpdateSurveyConfigDto } from "./dto/update-survey-config.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SurveyConfigService {
  constructor(private prisma: PrismaService) {}
  async createSurveyConfig(createSurveyConfigDto: CreateSurveyConfigDto) {
    // create new survey config
    const newConfig = await this.prisma.surveyConfig.create({
      data: createSurveyConfigDto,
    });
    return newConfig;
  }

  async getAllSurveyConfig(filter: SurveyConfigFilterDto) {
    const { maxQuestions, startTime, endTime, limit = 10, offset = 0 } = filter;
    return this.prisma.surveyConfig.findMany({
      where: {
        maxQuestions: maxQuestions ?? undefined, // Optional maxQuestions filter
        startTime: startTime ?? undefined, // Optional startTime filter
        endTime: endTime ?? undefined, // Optional endTime filter
      },
      skip: +offset,
      take: +limit,
    });
  }

  async updateSurveyConfigById(surveyConfigId: number, updateSurveyConfig: UpdateSurveyConfigDto) {
    // Check the document available for the given surveyId in database to update.
    const findSurveyConfigId = await this.prisma.surveyConfig.findUnique({
      where: {
        id: surveyConfigId,
      },
    });
    if (!findSurveyConfigId) {
      throw new NotFoundException(
        `Survey config with ID ${findSurveyConfigId} not found.`
      );
    }
    // Update the survey config by the id
    return this.prisma.surveyConfig.update({
      where: {
        id: surveyConfigId,
      },
      data: updateSurveyConfig,
    });
  }

  async deleteSurveyConfig(surveyConfigId: number) {
    // Find the survey config with the provided Id and check it exists or not before deleting
    const isExisted = await this.prisma.surveyConfig.findFirst({
      where: {
        id : surveyConfigId
      }
    })
    if (!isExisted) { 
      throw new NotFoundException(`The survey Config ID ${surveyConfigId} doesn't exist.`)
    }
    // Delete a single survey configuration based on its unique identifier (id).
    const deletedSurveyConfig = await this.prisma.surveyConfig.delete({
      where: {
        id: surveyConfigId
      }
    })
    return deletedSurveyConfig;
  }
}
