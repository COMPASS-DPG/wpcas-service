import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import _ from "lodash";
import {
  CreateFileUploadDto,
  CreateQuestionBankDto,
  CreateUpdateDeleteQuesitonsDto,
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
    const { competencyId, competencyLevelNumber, limit, offset, orderBy } =
      filter;
    return this.prisma.questionBank.findMany({
      where: {
        competencyId: competencyId ?? undefined, // Optional compentencyId filter
        competencyLevelNumber: competencyLevelNumber ?? undefined, // Optional competencyLevelNumber
      },
      orderBy: {
        [orderBy || "createdAt"]: "asc", // Default sorting by createdAt
      },
      skip: offset ?? undefined,
      take: limit ?? undefined,
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
    return this.prisma.questionBank.update({
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
    try {
      // Parsed the uploaded data
      let parsedData;
      parsedData = await this.fileUploadService.parseCSV(filepath);
      // Store the parsedData in the db
      await this.bulkUploadQuestions(parsedData);
    } catch (error) {
      await this.fileUploadService.deleteUploadedFile(filepath);
      throw error;
    }
    // Clean up after the sucessful upload of csv data
    await this.fileUploadService.deleteUploadedFile(filepath);
  }

  public async bulkUploadQuestions(data: CreateFileUploadDto[]) {
    // check the header from the data
    const headers = Object.keys(data[0]);
    const requiredHeaders = ["competency", "competencyLevelNumber", "question"];
    const nonValidHeader = headers.filter(
      (item) => !requiredHeaders.includes(item)
    );
    if (nonValidHeader.length) {
      throw new BadRequestException(`Invalid columns ${nonValidHeader}`);
    }
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
    const roles = userRoles?.Roles.map((item) => {
      return {
        id: item.id,
        name: item.name,
      };
    });

    const competenciesForRole = await Promise.all(
      roles?.map(async (role) => {
        const competency = await this.mockRoleService.getCompetenciesByRoleId(
          role.id
        );
        return competency;
      }) || []
    );
    
    // Flatten the array and extract unique competencyIds
    const uniqueCompetencyIds = Array.from(
      new Set(competenciesForRole.flat().map((comp) => comp.competencyId))
    );

    const questionLists: any = [];
    if (uniqueCompetencyIds?.length) {
      for (let i = 0; i < uniqueCompetencyIds.length; i++) {
        const questions = await this.prisma.questionBank.findMany({
          where: {
            competencyId: uniqueCompetencyIds[i],
          },
          select: {
            id: true,
            question: true,
          },
        });

        const mappedQuestions = _.map(questions, (data) => {
          const { id, question } = data;
          return {
            question,
            questionId: id,
          };
        });
        questionLists.push(...mappedQuestions);
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

  public async createUpdateDeleteQuesitons(
    questionBank: CreateUpdateDeleteQuesitonsDto
  ) {
    const { createQuestions, updateQuestions, deleteQuestions } = questionBank;
    await this.prisma.$transaction(async (prismaClient) => {
      if (!_.isUndefined(deleteQuestions) && !_.isEmpty(deleteQuestions)) {
        for (const deleteQuestionId of deleteQuestions) {
          await prismaClient.questionBank.delete({
            where: {
              id: deleteQuestionId,
            },
          });
        }
      }

      if (!_.isUndefined(updateQuestions) && !_.isEmpty(updateQuestions)) {
        for (const updateQuestion of updateQuestions) {
          await prismaClient.questionBank.update({
            where: {
              id: updateQuestion.questionId,
            },
            data: {
              question: updateQuestion.question,
            },
          });
        }
      }

      if (!_.isUndefined(createQuestions) && !_.isEmpty(createQuestions)) {
        for (const createQuestion of createQuestions) {
          const checkCompentencyId = await prismaClient.competency.findUnique({
            where: {
              id: createQuestion.competencyId,
            },
          });

          if (!checkCompentencyId) {
            throw new NotFoundException("Competency is not Found");
          }

          await prismaClient.questionBank.create({
            data: {
              competencyId: createQuestion.competencyId,
              competencyLevelNumber: createQuestion.competencyLevelNumber,
              question: createQuestion.question,
            },
          });
        }
      }
    });
  }

  public async getUnmappedCompetency() {
    const QuestionsMappedWithCompetency =
      await this.prisma.questionBank.findMany();
    //  console.log("QuestionsMappedWithCompetency", QuestionsMappedWithCompetency);
    const mappedCompetenciesSet = new Set(
      QuestionsMappedWithCompetency.map(
        (mapped) => `${mapped.competencyId}_${mapped.competencyLevelNumber}`
      )
    );
    // get all competencies
    const allCompetencies =
      await this.competencyService.findAllCompetenciesWithLevelNames();

    const unmappedCompetencies: {
      competencyId: number;
      competencyLevelNumber: number;
    }[] = [];

    allCompetencies.forEach((competency) => {
      const { competencyLevels } = competency;
      competencyLevels.forEach(async (level) => {
        const key = `${level.competencyId}_${level.competencyLevel.levelNumber}`;

        if (!mappedCompetenciesSet.has(key)) {
          unmappedCompetencies.push({
            competencyId: level.competencyId,
            competencyLevelNumber: level.competencyLevel.levelNumber,
          });
        }
      });
    });
    const data: any = [];
    // Use map to create an array of promises
    const promises = unmappedCompetencies.map(async (item) => {
      const competency = (
        await this.competencyService.findCompetencyById(item.competencyId)
      ).name;
      const competencyAndLevel = {
        competency,
        competencyLevelNumber: item.competencyLevelNumber,
      };
      return competencyAndLevel; // Return the value to the map function
    });

    try {
      await Promise.all(promises)
        .then((result) => {
          // All asynchronous operations have completed
          data.push(...result); // Push all results to the data array
        })
        .catch((error) => {
          // Handle errors if any of the promises reject
          console.error(error);
        });
    } catch (error) {
      console.error("Error storing data in the database:", error);
      throw new Error("Failed to store data in the database");
    }
    return data;
  }

  public async getQuestionBankTemplate() {
    const header = ["competency", "competencyLevelNumber", "question"];
    // get all unmapped competency and their competencyLevelNumber for which there
    // is no any question associated with it
    const unmappedCompetencies = await this.getUnmappedCompetency();
    return {
      header,
      unmappedCompetencies,
    };
  }
}
