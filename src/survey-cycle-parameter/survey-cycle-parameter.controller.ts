import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { ResponseSurveyCycleParameterDto } from "./dto/response-survey-cycle-parameter.dto";
import { CreateSurveyCycleParameterDto, SurveyCycleParameterFilterDto } from "./dto/create-survey-cycle-parameter.dto";
import { UpdateSurveyCycleParameterDto } from "./dto/update-survey-cycle-parameter.dto";
import { SurveyCycleParameterService } from "./survey-cycle-parameter.service";

@ApiTags("survey-cycle-parameter")
@Controller("survey-cycle-parameter")
export class SurveyCycleParameterController {
  // Create a logger instance for this log events and errors
  private readonly logger = new Logger(SurveyCycleParameterController.name);

  // The survey parameter controller class, injecting the survey parameter service.
  constructor(
    private readonly surveyParameterService: SurveyCycleParameterService
  ) {}

  // Api to create a new survey parameter
  @Post()
  @ApiOperation({ summary: "Create a Survey cycle parameter" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseSurveyCycleParameterDto,
  }) // Api response for swagger
  async createSurveyParameter(
    @Res() res,
    @Body() createSurveyCycleParameterDto: CreateSurveyCycleParameterDto
  ): Promise<ResponseSurveyCycleParameterDto> {
    try {
      // Log the initiation for the Survey Parameter creation
      this.logger.log(`Initiate to create a Survey cycle Parameter`);

      const createdSurveyParameter =
        await this.surveyParameterService.createSurveyParameter(
          createSurveyCycleParameterDto
        );
      // Log the successful creation of the survey parameter
      this.logger.log(`Successfully Created Survey cycle Parameter`);
      // Return a success response with the created survey parameter.
      return res.status(HttpStatus.CREATED).json({
        message: "Survey cycle parameter created successfully.",
        data: createdSurveyParameter,
      });
    } catch (error) {
      this.logger.error(`Failed to create new survey cycle Parameter.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create new survey cycle Parameter.`,
      });
    }
  }

  // Api to get all the survey parameter
  @Get()
  @ApiOperation({ summary: "Find All Survey cycle parameters" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyCycleParameterDto,
    isArray: true,
  }) // Api response for swagger
  async getAllSurveyParameter(
    @Res() res,
    @Query() filter: SurveyCycleParameterFilterDto
  ): Promise<ResponseSurveyCycleParameterDto[]> {
    try {
      this.logger.log(`Initiated fetching all the survey cycle parameter.`);
      const surveyParameters =
        await this.surveyParameterService.getAllSurveyParameter(filter);

      if (!surveyParameters.length) throw Error("No record found");
      this.logger.log(`Fetched successfully all the survey cycle parameter.`);

      return res.status(HttpStatus.OK).json({
        message: "Successfully fetched all survey cycle parameter.",
        data: surveyParameters,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch survey cycle parameters`, error);
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to Get all survey cycle parameters.`,
      });
    }
  }

  // Api to update the survey parameter by using the Id.
  @Patch("update/:id")
  @ApiOperation({ summary: "Update the survey cycle parameter by Id." })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyCycleParameterDto,
  })
  async updateSurveyParameterById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSurveyCycleParameterDto: UpdateSurveyCycleParameterDto
  ): Promise<ResponseSurveyCycleParameterDto> {
    try {
      this.logger.log(
        `Initiated updating the survey cycle parameter for id #${id}`
      );
      let updatedSurveyParameter =
        await this.surveyParameterService.updateSurveyParameterById(
          id,
          updateSurveyCycleParameterDto
        );
      this.logger.log(
        `Successfully updated survey cycle parameter for id #${id}`
      );
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated survey cycle parameter for id #${id}`,
        data: updatedSurveyParameter,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update survey cycle parameter for id #${id}`,
        error
      );
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to update survey cycle parameter for id #${id}`,
      });
    }
  }
}
