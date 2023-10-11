import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
  HttpStatus,
  Res,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { SurveyParameterService } from "./survey-parameter.service";
import { CreateSurveyParameterDto } from "./dto/create-survey-parameter.dto";
import { UpdateSurveyParameterDto } from "./dto/update-survey-parameter.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseSurveyParameterdto } from "./dto/response-survey-parameter.dto";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@ApiTags("survey-parameter")
@Controller("survey-parameter")
export class SurveyParameterController {
  // Create a logger instance for this log events and errors
  private readonly logger = new Logger(SurveyParameterController.name);

  // The survey parameter controller class, injecting the survey parameter service.
  constructor(
    private readonly surveyParameterService: SurveyParameterService
  ) {}

  // Api to create a new survey parameter
  @Post()
  @ApiOperation({ summary: "Create a Survey parameter" }) // Api operation for swagger
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseSurveyParameterdto }) // Api response for swagger
  async createSurveyParameter(
    @Res() res,
    @Body() createSurveyParameterDto: CreateSurveyParameterDto
  ): Promise<ResponseSurveyParameterdto> {
    try {
      // Log the initiation for the Survey Parameter creation
      this.logger.log(`Initiate to create a Survey Parameter`);

      const createdSurveyParameter =
        await this.surveyParameterService.createSurveyParameter(
          createSurveyParameterDto
        );
      // Log the successful creation of the survey parameter
      this.logger.log(`Successfully Created Survey Parameter`);
      // Return a success response with the created survey parameter.
      return res.status(HttpStatus.CREATED).json({
        message: "Survey parameter created sucessfully.",
        data: createdSurveyParameter,
      });
    } catch (error) {
      this.logger.error(`Failed to create new survey Parameter.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to create new survey Parameter.`,
      });
    }
  }

  // Api to get all the survey parameter
  @Get()
  @ApiOperation({ summary: "Find All Survey parameters" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyParameterdto,
    isArray: true,
  }) // Api response for swagger
  async getAllSurveyParameter(
    @Res() res
  ): Promise<ResponseSurveyParameterdto[]> {
    try {
      this.logger.log(`Initiated fetching all the survey parameter.`);
      const surveyParameters =
        await this.surveyParameterService.getAllSurveyParameter();

      if (!surveyParameters.length) throw Error("No record found");
      this.logger.log(`Fetched successfully all the survey parameter.`);

      return res.status(HttpStatus.OK).json({
        message: "Successfully fetched all survey config.",
        data: surveyParameters,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch survey parameters`, error);
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code
      // Return an error response
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to Get all survey parameters.`,
      });
    }
  }

  // Api to update the survey parameter by using the Id.
  @Patch("update/:id")
  @ApiOperation({ summary: "Update the survey parameter by Id." })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyParameterdto,
  })
  async updateSurveyParameterById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSurveyParameterDto: UpdateSurveyParameterDto
  ): Promise<ResponseSurveyParameterdto> {
    try {
      this.logger.log(`Initiated updating the survey parameter for id #${id}`);
      let updatedSurveyParameter =
        await this.surveyParameterService.updateSurveyParameterById(
          id,
          updateSurveyParameterDto
        );
      this.logger.log(`Successfully updated survey parameter for id #${id}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated survey parameter for id #${id}`,
        data: updatedSurveyParameter,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update survey parameter for id #${id}`,
        error
      );
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code
      // Return an error response
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message:
          errorMessage || `Failed to update survey parameter for id #${id}`,
      });
    }
  }
}
