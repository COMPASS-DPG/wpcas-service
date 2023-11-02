import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSurveyCycleParameterDto, SurveyCycleParameterFilterDto } from "./dto/create-survey-cycle-parameter.dto";
import { UpdateSurveyCycleParameterDto } from "./dto/update-survey-cycle-parameter.dto";

@Injectable()
export class SurveyCycleParameterService {
  constructor(private prisma: PrismaService) {}

  // To check if the survey parameter exist in database or not
  async checkIfSurveyParameterExists() {
    return this.prisma.surveyCycleParameter.findFirst();
  }

  async createSurveyParameter(
    createSurveyCycleParameterDto: CreateSurveyCycleParameterDto
  ) {
    const existingSurveyParameter = await this.checkIfSurveyParameterExists();

    if (existingSurveyParameter) {
      throw new ConflictException("Survey parameter already exists.");
    }

    // create a new survey parameter
    const newSurveyParameter = await this.prisma.surveyCycleParameter.create({
      data: createSurveyCycleParameterDto,
    });
    return newSurveyParameter;
  }

  async getAllSurveyParameter(filter: SurveyCycleParameterFilterDto) {
    const {departmentId, surveyConfigId, isActive} = filter;
    return this.prisma.surveyCycleParameter.findMany({
      where:{
        isActive: isActive ?? undefined,
        SurveyConfig:{
          id: surveyConfigId ?? undefined,
          AdminDepartment:{
            id: departmentId ??undefined
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }

  async updateSurveyParameterById(
    surveyParameterId: number,
    updateSurveyCycleParameter: UpdateSurveyCycleParameterDto
  ) {
    // check if for the given id, data is available in db or not
    const findSurveyParameterId =
      await this.prisma.surveyCycleParameter.findUnique({
        where: {
          id: surveyParameterId,
        },
      });
    if (!findSurveyParameterId) {
      throw new NotFoundException(
        `Survey parameter with ID ${findSurveyParameterId} not found.`
      );
    }
    // update an existing survey parameter by its unique identifier (id).
    return this.prisma.surveyCycleParameter.update({
      where: {
        id: surveyParameterId,
      },
      data: updateSurveyCycleParameter,
    });
  }
}
