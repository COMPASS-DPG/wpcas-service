import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  Res,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from "@nestjs/common";
import { QuestionBankService } from "./question-bank.service";
import {
  CreateQuestionBankDto,
  CreateUpdateDeleteQuesitonsDto,
  QuestionBankFilterDto,
} from "./dto/create-question-bank.dto";
import { UpdateQuestionBankDto } from "./dto/update-question-bank.dto";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseQuestionBankDto } from "./dto/response-question-bank.dto";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../config/multer-options.config";

@Controller("question-bank")
@ApiTags("question-bank")
export class QuestionBankController {
  // Create a logger instance for this controller to log events and errors.
  private readonly logger = new Logger(QuestionBankController.name);

  // The question bank controller class, injecting the question bank service.
  constructor(private readonly questionBankService: QuestionBankService) {}

  // Api for creating a new question
  @Post()
  @ApiOperation({ summary: "Create a new question" }) // Api operation for the swagger
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseQuestionBankDto }) // Api response for the swagger
  async createQuestionByCompentencyLevel(
    @Res() res,
    @Body() createQuestionBankDto: CreateQuestionBankDto
  ): Promise<ResponseQuestionBankDto> {
    try {
      // Log the initiation for the question creation
      this.logger.log(`Initiate to create a question`);

      const createdQuestion =
        await this.questionBankService.createQuestionByCompentencyId(
          createQuestionBankDto
        );
      // Log the successful creation of the question bank
      this.logger.log(`Successfully created question`);
      return res.status(HttpStatus.CREATED).json({
        message: "Question created sucessfully.",
        data: createdQuestion,
      });
    } catch (error) {
      this.logger.error(`Failed to create new question.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create new question.`,
      });
    }
  }

  // Api for getting all questions or by filtering using competencyId or competencyLevelId
  @Get()
  @ApiOperation({ summary: "Get all the questions" }) // Api operation for the swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseQuestionBankDto,
    isArray: true,
  }) // Api response for the swagger
  async getAllQuestions(
    @Res() res,
    @Query() filter: QuestionBankFilterDto
  ): Promise<ResponseQuestionBankDto[]> {
    try {
      // Log the initiation for fetching all the questions
      this.logger.log(`Initiated fetching all the questions.`);
      const questions = await this.questionBankService.getAllQuestions(filter);

      // Log the successful fetching of data from db.
      this.logger.log(`Successfully fetched all questions`);

      // return the successful response for fetching the data from the db.
      return res.status(HttpStatus.OK).json({
        message: "Successfully fetched all questions.",
        data: questions,
      });
    } catch (error) {
      // log the error message
      this.logger.error(`Failed to get all questions.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to get all questions.`,
      });
    }
  }

  // Api to update the question by Id
  @Patch("update/:id")
  @ApiOperation({ summary: "Update the question by Id" }) // Api operation for the swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseQuestionBankDto,
  }) // Api operation for the swagger
  async updateQuestionById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateQuestionBankDto: UpdateQuestionBankDto
  ): Promise<ResponseQuestionBankDto> {
    try {
      // Log the initiation for updating the question for the given id
      this.logger.log(`Initiated updating the question for id #${id}`);
      // Update the question for the id
      const updateQuestion = await this.questionBankService.updateQuestionById(
        id,
        updateQuestionBankDto
      );
      // Log the successful update of the question with the given id
      this.logger.log(`Successfully updated question for id #${id}`);
      // Return response and statuscode for the successful update of the question
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated question for id #${id}`,
        data: updateQuestion,
      });
    } catch (error) {
      // Log the error
      this.logger.error(`Failed to update question for id #${id}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      // Return the response and status code for the failed update of the question
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to update question for id #${id}`,
      });
    }
  }

  // Delete the Question for the id
  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete the question by Id" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseQuestionBankDto,
  })
  async deleteQuestionById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseQuestionBankDto> {
    try {
      this.logger.log(`Initiating deleting of a question with an id ${id}`);

      const deletedQuestion = await this.questionBankService.deleteQuestionById(
        id
      );

      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted question for id #${id}`,
        data: deletedQuestion,
      });
    } catch (error) {
      this.logger.error(`Failed to delete question for id #${id}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to delete question for id #${id}`,
      });
    }
  }
  // API to upload csv file question bank
  @Post("upload")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @ApiConsumes("multipart/form-data") // Specify content type as multipart/form-data
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string" || "number",
          format: "binary",
        },
      },
    },
  })
  async uploadQuestions(@UploadedFile() file, @Res() res) {
    // Log the initiaton for csv file upload
    this.logger.log(`Initiate to upload a csv file.`);
    try {
      await this.questionBankService.uploadCsvFile(file.path);
      this.logger.log(`Successfully uploaded question bank.`);
      return res.status(HttpStatus.CREATED).json({
        message: "Question bank uploaded sucessfully.",
      });
    } catch (error) {
      this.logger.error(`Failed to upload question bank.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to upload question bank.`,
      });
    }
  }

  // Get all the mapped questions for the user
  @Get("user/:id")
  @ApiOperation({
    summary: "Get all the questions for a user in the survey form.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseQuestionBankDto,
    isArray: true,
  })
  async getAllQuestionsForUser(
    @Res() res,
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ResponseQuestionBankDto[]> {
    try {
      this.logger.log(
        `Initiating the fetching of all the question for user with id#${id}`
      );

      const getAllQuestionsForUser =
        await this.questionBankService.getAllQuestionsForUser(id);

      return res.status(HttpStatus.OK).json({
        message: `Successfully get all the question for id #${id}`,
        data: getAllQuestionsForUser,
      });
    } catch (error) {
      this.logger.error(`Failed to get all questions for id #${id}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to get all questions for id #${id}`,
      });
    }
  }

  //API to Create, Update and Delete Multiple Questions
  @Post("/updateMultipleQuestions")
  @ApiOperation({ summary: "Create, Update and Delete Multiple Questions" })
  @ApiResponse({ status: HttpStatus.OK })
  async createUpdateDeleteQuesitons(
    @Res() res,
    @Body() createUpdateDeleteQuesitonsDto: CreateUpdateDeleteQuesitonsDto
  ) {
    // Log the initiaton for csv file upload
    this.logger.log(`Initiate updating the question bank.`);
    try {
      await this.questionBankService.createUpdateDeleteQuesitons(
        createUpdateDeleteQuesitonsDto
      );
      this.logger.log(`Successfully updated the question bank.`);
      return res.status(HttpStatus.CREATED).json({
        message: "Question bank updated sucessfully.",
      });
    } catch (error) {
      this.logger.error(`Failed to update question bank.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to update question bank.`,
      });
    }
  }

  // API to get question bank template header
  @Get("/template")
  @ApiOperation({ summary: "get question bank template" })
  @ApiResponse({ status: HttpStatus.OK })
  async getQuestionBankTemplate(
    @Res() res
  ) {
    this.logger.log(`Initiate to fetch the question bank template.`);
    try {
      const header = await this.questionBankService.getQuestionBankTemplate();
       this.logger.log(
         `Successfully fetch the question bank template.`
       );
       return res.status(HttpStatus.CREATED).json({
         message: "Successfully fetch the question bank template.",
         data : header
       });
    } catch (error) {
      this.logger.error(`Failed to get the question bank template.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage || `Failed to get the question bank template.`,
      });
    }
  }
}
