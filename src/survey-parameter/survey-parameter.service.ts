import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSurveyParameterDto } from "./dto/create-survey-parameter.dto";
import { UpdateSurveyParameterDto } from "./dto/update-survey-parameter.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SurveyParameterService {
  constructor(private prisma: PrismaService) {}
  async createSurveyParameter(
    createSurveyParameterDto: CreateSurveyParameterDto
  ) {
    // create a new survey parameter
    const newSurveyParameter = await this.prisma.surveyParameters.create({
      data: createSurveyParameterDto,
    });
    return newSurveyParameter;
  }

  async getAllSurveyParameter() {
    return this.prisma.surveyParameters.findMany();
  }

  async updateSurveyParameterById(
    surveyParameterId: number,
    updateSurveyParameter: UpdateSurveyParameterDto
  ) {
    // check if for the given id, data is available in db or not
    const findSurveyParameterId = await this.prisma.surveyParameters.findUnique(
      {
        where: {
          id: surveyParameterId,
        },
      }
    );
    if (!findSurveyParameterId) {
      throw new NotFoundException(
        `Survey parameter with ID ${findSurveyParameterId} not found.`
      );
    }
    // update an existing survey parameter by its unique identifier (id).
    return this.prisma.surveyParameters.update({
      where: {
        id: surveyParameterId,
      },
      data: updateSurveyParameter,
    });
  }
}
