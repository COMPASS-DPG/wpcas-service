import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateFileUploadDto,
  CreateQuestionBankDto,
  QuestionBankFilterDto,
} from "./dto/create-question-bank.dto";
import { UpdateQuestionBankDto } from "./dto/update-question-bank.dto";
import { PrismaService } from "../prisma/prisma.service";
import { MockCompetencyService } from "../mockModules/mock-competency/mock-competency.service";
import { MockUserService } from "../mockModules/mock-user/mock-user.service";
import { MockRoleService } from "./../mockModules/mock-role/mock-role.service";
import { MockDesignationService } from "../mockModules/mock-designation/mock-designation.service";
import { FileUploadService } from "../file-upload/file-upload.service";

@Injectable()
export class QuestionBankService {
  constructor(
    private prisma: PrismaService,
    private competencyService: MockCompetencyService,
    private mockUserService: MockUserService,
    private mockDesignationService: MockDesignationService,
    private mockRoleService: MockRoleService,
    private fileUploadService: FileUploadService
  ) {}

  async createQuestionByCompentencyId(
    createQuestionBankDto: CreateQuestionBankDto
  ) {
    // check for compentencyId exist in competency model in db
    const checkCompentencyId = await this.prisma.competency.findUnique({
      where: {
        id: createQuestionBankDto.competencyId,
      },
    });

    // if not found throw error
    if (!checkCompentencyId) {
      throw new NotFoundException(
        "Either Competency or Competency Level is not Found"
      );
    }
    // Otherwise create a new question bank
    const newQuestion = await this.prisma.questionBank.create({
      data: createQuestionBankDto,
    });
    return newQuestion;
  }

  async getAllQuestions(filter: QuestionBankFilterDto) {
    // Get all questions and filter using compentencyId and compentencyLevelId
    const {
      competencyId,
      competencyLevelNumber,
      limit = 10,
      offset = 0,
      orderBy,
    } = filter;
    return this.prisma.questionBank.findMany({
      where: {
        competencyId: competencyId ?? undefined, // Optional compentencyId filter
        competencyLevelNumber: competencyLevelNumber ?? undefined, // Optional competencyLevelNumber
      },
      orderBy: {
        [orderBy || "createdAt"]: "asc", // Default sorting by createdAt
      },
      skip: offset,
      take: limit,
    });
  }

  async updateQuestionById(
    questionId: number,
    updateQuestionBankDto: UpdateQuestionBankDto
  ) {
    // Check if there is question in db for the questionId
    const findQuestion = await this.prisma.questionBank.findUnique({
      where: {
        id: questionId,
      },
    });
    // If not found throw error message
    if (!findQuestion) {
      throw new NotFoundException(
        `No question exists with the id #${questionId}.`
      );
    }
    // Otherwise update it's details
    return this.prisma.questionBank.updateMany({
      where: {
        id: questionId,
      },
      data: updateQuestionBankDto,
    });
  }

  async deleteQuestionById(questionId: number) {
    // Check the question is there in db for the given questionId and competencyLevelId
    const findQuestion = await this.prisma.questionBank.findUnique({
      where: {
        id: questionId,
      },
    });
    // If not found throw error message
    if (!findQuestion) {
      throw new NotFoundException(
        `No question exists with the Id #${questionId}.`
      );
    }
    // Otherwise delete question related to that competency id
    return this.prisma.questionBank.delete({
      where: {
        id: questionId,
      },
    });
  }

  public async uploadCsvFile(filepath) {
    // Parsed the uploaded data
    const parsedData = await this.fileUploadService.parseCSV(filepath);
    // Store the parsedData in the db
    await this.bulkUploadQuestions(parsedData);
    // Clean up after the sucessful upload of csv data
    await this.fileUploadService.deleteUploadedFile(filepath);
  }

  public async bulkUploadQuestions(data: CreateFileUploadDto[]) {
    // Check if the competency Existed or not the given csv data if not then filter and throw error
    const allCompetencies = await this.competencyService.findAllCompetencies();

    // Extract an array of competency names from the fetched competencies
    const competencyNames = allCompetencies.map(
      (competency) => competency.name
    );

    // check for the data that is not in the competency model
    const dataNotInCompetencyModel = data.filter(
      (item) => !competencyNames.includes(item["competency"])
    );

    // If there is data not in the competency model, you can throw an error or handle it as needed.
    if (dataNotInCompetencyModel.length > 0) {
      throw new Error(
        `Some data is not in the competency model #${dataNotInCompetencyModel
          .map((item) => item.competency)
          .join(",")}`
      );
    }

    // Check for the non-numeric competencyLevelNumber which is not a number in the csv data
    const dataWithNonNumericCompetencyLevelNumber = data.filter((item) => {
      const competencyLevelNumber = Number(item.competencyLevelNumber);
      return (
        isNaN(competencyLevelNumber) ||
        competencyLevelNumber < 1 ||
        competencyLevelNumber > 7
      ); // Check if it's not a number and value should b/w 1 to 7
    });
    // Throw an error for the dataWithNonNumericCompetencyLevelNumber
    if (dataWithNonNumericCompetencyLevelNumber.length > 0) {
      throw new Error(
        `The following competency level numbers are not numeric : ${dataWithNonNumericCompetencyLevelNumber
          .map(
            (item) =>
              `Competency ${item?.competency} with competency value #${
                item?.competencyLevelNumber || "Empty"
              }.`
          )
          .join(",")}`
      );
    }

    // Filter for the empty question in the csv data
    const dataEmptyQuestion = data.filter((item) => !item.question);
    // Throw an error for the dataEmptyQuestion
    if (dataEmptyQuestion.length > 0) {
      throw new Error(
        `The following questions are empty: ${dataEmptyQuestion
          .map(
            (item) =>
              `Competency ${item?.competency} with competency value#${item?.competencyLevelNumber}.`
          )
          .join(",")}`
      );
    }

    const createManyDataPromises: Promise<void>[] = data.map(async (item) => {
      const getCompetency = await this.competencyService.findCompetencyByName(
        item.competency
      );
      if (getCompetency && getCompetency.id) {
        // Check if a question with the same competencyId exists in the database
        const existingQuestion = await this.prisma.questionBank.findFirst({
          where: {
            competencyId: getCompetency.id,
            competencyLevelNumber: Number(item["competencyLevelNumber"]),
          },
        });
        if (existingQuestion) {
          // If it exists, update the existing question
          await this.prisma.questionBank.update({
            where: {
              id: existingQuestion.id,
            },
            data: {
              question: item["question"],
              competencyLevelNumber: Number(item["competencyLevelNumber"]),
            },
          });
        } else {
          // If it doesn't exist, create a new entry
          await this.createQuestionByCompentencyId({
            question: item["question"],
            competencyId: getCompetency.id,
            competencyLevelNumber: Number(item["competencyLevelNumber"]),
          });
        }
      } else {
        throw new Error("Competency Id not found");
      }
    });
    try {
      await Promise.all(createManyDataPromises);
    } catch (error) {
      console.error("Error storing data in the database:", error);
      throw new Error("Failed to store data in the database");
    }
  }

  
  
  async getAllQuestionsForUser(userId: string) {
    const user = await this.mockUserService.findOne(userId);
    if (!user) {
      // Handle the case when the user is not found.
      throw new Error("User not found");
    }

    // Get the user's designation
    const designation = user.designation;

    // Get all the roles for a designation
    const userRoles =
      await this.mockDesignationService.findAllRolesForDesignation(designation);

    // Get roleId of each role of the user
    const roleIds = userRoles?.Roles.map((item) => {
      return item.id;
    });

    // unique competencyId associated with the roles of the user
    const competencyIds: any = [];
    if (roleIds?.length) {
      for (let i = 0; i < roleIds.length; i++) {
        const competency = (await this.mockRoleService.findRoleById(roleIds[i]))
          .competencies;
        competencyIds.push(
          ...competency.filter((item) => {
            if (!competencyIds.includes(item.competencyId)) {
              competencyIds.push(item.competencyId);
            }
          })
        );
      }
    }

    // Get competencyLevel for an user
    let competencyLevelNumber = user.Level?.levelNumber;

    const questionLists: any = [];
    if (competencyIds?.length && competencyLevelNumber) {
      for (let i = 0; i < competencyIds.length; i++) {
        while (competencyLevelNumber) {
          let question = await this.getAllQuestions({
            competencyId: competencyIds[i],
            competencyLevelNumber: competencyLevelNumber,
          });
          questionLists.push(...question);
          competencyLevelNumber--;
        }
      }
    }
    if (!questionLists.length) {
      throw new NotFoundException(`No Question Found for user with #${userId}`);
    }
    return questionLists;
  }

  public async getQuestionById(id: number) {
    const question = await this.prisma.questionBank.findUnique({
      where: { id },
    });

    if (!question)
      throw new NotFoundException(`question with id #${id} not found`);
    return question;
  }
}
