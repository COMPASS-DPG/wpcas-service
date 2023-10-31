import { Injectable, NotFoundException } from "@nestjs/common";
import { SurveyStatusEnum } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSurveyFormDto, SurveyScoresForUser } from "./dto";

@Injectable()
export class SurveyFormService {
  constructor(private prisma: PrismaService) {}

  async createSurveyForm(createSurveyFormDto: CreateSurveyFormDto) {
    const surveyFormDto = {
      ...createSurveyFormDto,
      questionsJson: JSON.parse(
        JSON.stringify(createSurveyFormDto.questionsJson)
      ),
    };
    return await this.prisma.surveyForm.create({
      data: { ...surveyFormDto },
    });
  }

  async findSurveyFormById(id: number) {
    const surveyForm = await this.prisma.surveyForm.findUnique({
      where: { id },
    });
    if (!surveyForm) {
      throw new NotFoundException("Survey Form not found");
    }
    return surveyForm;
  }

  async updateSurveyFormStatus(id: number, status: SurveyStatusEnum) {
    return await this.prisma.surveyForm.update({
      where: { id },
      data: { status },
    });
  }

  async findSurveyFormBySurveyCycleParameterId(paramId: number){
    const surveyForms = await this.prisma.surveyForm.findMany({
      where:{
        surveyCycleParameterId: paramId
      }
    });
    if(!surveyForms || surveyForms.length==0){
      throw new NotFoundException(`Survey Forms not found for SurveyCycleParameter with id #${paramId}`);
    }
    return surveyForms;
  }

  async updateSurveyFormScore(id: number, overallScore: number) {
    return await this.prisma.surveyForm.update({
      where: { id },
      data: { overallScore },
    });
  }

  async deleteSurveyForm(id: number) {
    return await this.prisma.surveyForm.delete({
      where: { id },
    });
  }

  public async getAllSurveyFormScoresByUserId(
    userId: string
  ): Promise<SurveyScoresForUser[]> {
    const userMetadata = await this.prisma.userMetadata.findUnique({
      where: { userId },
    });

    if (!userMetadata)
      throw new NotFoundException(`User with id #${userId} not found`);

    const response = await this.prisma.surveyForm.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        userId: true,
        status: true,
        overallScore: true,
        sunbirdCredentialIds: true,
        SurveyScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response;
  }

  public async getLatestSurveyFormScoresByUserId(
    userId: string
  ): Promise<SurveyScoresForUser> {
    const userMetadata = await this.prisma.userMetadata.findUnique({
      where: { userId },
    });

    if (!userMetadata)
      throw new NotFoundException(`User with id #${userId} not found`);

    const latestSurveyForm = await this.prisma.surveyForm.findMany({
      where: {
        userId,
        status: SurveyStatusEnum.CLOSED, // Get score for only closed survey form
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt in descending order to get the latest survey form
      },
      select: {
        id: true,
        status: true,
        userId: true,
        overallScore: true,
        sunbirdCredentialIds: true,
        SurveyScore: true,
        createdAt: true,
        updatedAt: true,
      },
      take: 1, // Limit the query to return only one result
    });

    return latestSurveyForm[0];
  }
}
