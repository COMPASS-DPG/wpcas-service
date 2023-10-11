import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Logger,
  HttpStatus,
  Res,
  Query,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { SurveyConfigService } from "./survey-config.service";
import {
  CreateSurveyConfigDto,
  SurveyConfigFilterDto,
} from "./dto/create-survey-config.dto";
import { UpdateSurveyConfigDto } from "./dto/update-survey-config.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseSurveyConfigDto } from "./dto/response-survey-config.dto";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@Controller("survey-config")
@ApiTags("survey-config")
export class SurveyConfigController {
  // Create a logger instance for this controller to log events and errors.
  private readonly logger = new Logger(SurveyConfigController.name);

  // The survey config controller class, injecting the survey config service.
  constructor(private readonly surveyConfigService: SurveyConfigService) {}

  @Post()
  @ApiOperation({ summary: "Create a survey config" }) // Describes the api operation for Swagger.
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseSurveyConfigDto }) // Describes the response for Swagger.
  async createSurveyConfig(
    @Res() res,
    @Body() createSurveyConfigDto: CreateSurveyConfigDto
  ): Promise<ResponseSurveyConfigDto> {
    try {
      // Log the initiation for the Survey config creation
      this.logger.log(`Creating a new survey config`);
      const createdSurveyConfig =
        await this.surveyConfigService.createSurveyConfig(
          createSurveyConfigDto
        );

      // Log the successful creation of the survey config
      this.logger.log(`Successfully created the new survey config.`);

      // Return a success response with the created survey config data
      return res.status(HttpStatus.CREATED).json({
        message: "Survey config created successfully",
        data: createdSurveyConfig,
      });
    } catch (error) {
      this.logger.error(`Failed to create new survey config.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      // Return an error response
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to create new survey config.`,
      });
    }
  }

  // Get all survey config
  @Get()
  @ApiOperation({ summary: "Get all Survey config" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyConfigDto,
    isArray: true,
  }) // Api response for Swagger.
  async getAllSurveyConfig(
    @Res() res,
    @Query() filter: SurveyConfigFilterDto
  ): Promise<ResponseSurveyConfigDto[]> {
    try {
      this.logger.log(`Initiated fetching all the survey config.`);
      const surveyConfigs = await this.surveyConfigService.getAllSurveyConfig(
        filter
      );
      this.logger.log(`Successfully fetched survey config`);

      return res.status(HttpStatus.OK).json({
        message: "Successfully fetched all survey config.",
        data: surveyConfigs,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch survey configs`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to Get all survey config.`,
      });
    }
  }

  // Update the survey config
  @Patch("/update/:id")
  @ApiOperation({ summary: "Update the survey config by ID" }) // Api operation for swagger
  @ApiResponse({ status: HttpStatus.OK, type: ResponseSurveyConfigDto }) // Api operation for swagger
  async updateSurveyConfigById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSurveyConfigDto: UpdateSurveyConfigDto
  ): Promise<ResponseSurveyConfigDto> {
    try {
      this.logger.log(`Initiated updating the survey config for id #${id}`);
      const updateSurveyConfig =
        await this.surveyConfigService.updateSurveyConfigById(
          id,
          updateSurveyConfigDto
        );
      this.logger.log(`Successfully updated survey config for id #${id}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully updated survey config for id #${id}`,
        data: updateSurveyConfig,
      });
    } catch (error) {
      this.logger.error(`Failed to update survey config for id #${id}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to update survey config for id #${id}`,
      });
    }
  }

  // Delete the survey config
  @Delete("/delete/:id")
  @ApiOperation({ summary: "Delete the survey config by Id" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseSurveyConfigDto,
  })
  async deleteSurveyConfigById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseSurveyConfigDto> {
    try {
      this.logger.log(
        `Initiating deleting of a survey config with an id ${id}`
      );

      const deletedSurveyConfig =
        await this.surveyConfigService.deleteSurveyConfig(id);

      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted survey config for id #${id}`,
        data: deletedSurveyConfig,
      });
    } catch (error) {
      this.logger.error(`Failed to delete survey config for id #${id}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode,
        message: errorMessage || `Failed to delete survey config for id #${id}`,
      });
    }
  }
}
