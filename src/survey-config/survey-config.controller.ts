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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { SurveyConfigService } from "./survey-config.service";
import {
  CreateSurveyConfigDto,
  SurveyConfigFilterDto,
} from "./dto/create-survey-config.dto";
import { UpdateSurveyConfigDto } from "./dto/update-survey-config.dto";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConfigResponseDTO, ResponseSurveyConfigDto, SampleUserMappingResponse } from "./dto/response-survey-config.dto";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../config/multer-options.config";

@Controller("survey-config")
@ApiTags("survey-config")
export class SurveyConfigController {
  // Create a logger instance for this controller to log events and errors.
  private readonly logger = new Logger(SurveyConfigController.name);

  // The survey config controller class, injecting the survey config service.
  constructor(private readonly surveyConfigService: SurveyConfigService) {}

  @Post()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Create a survey config" }) // Describes the api operation for Swagger.
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @ApiResponse({ status: HttpStatus.CREATED, type: ConfigResponseDTO })
  async createSurveyConfig(
    @Res() res,
    @UploadedFile() file,
    @Body() createSurveyConfigDto: CreateSurveyConfigDto
  ): Promise<ConfigResponseDTO> {
    try {
      // Log the initiation for the Survey config creation
      this.logger.log(`Creating a new survey config`);
      const createdSurveyConfig =
        await this.surveyConfigService.createSurveyConfig(
          file.path, createSurveyConfigDto
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
      return res.status(statusCode).json({
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

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to Get all survey config.`,
      });
    }
  }

  // Update the survey config
  @Patch("/update/:id")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file", multerOptions))
  @ApiOperation({ summary: "Update the survey config by ID" }) // Api operation for swagger
  @ApiResponse({ status: HttpStatus.OK, type: ConfigResponseDTO }) // Api operation for swagger
  async updateSurveyConfigById(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file,
    @Body() updateSurveyConfigDto: UpdateSurveyConfigDto
  ): Promise<ConfigResponseDTO> {
    try {
      this.logger.log(`Initiated updating the survey config for id #${id}`);
      const updateSurveyConfig =
        await this.surveyConfigService.updateSurveyConfigById(
          id,
          updateSurveyConfigDto,
          file ? file.path: null,
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

      return res.status(statusCode).json({
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

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to delete survey config for id #${id}`,
      });
    }
  }

  @Get("user-mapping-sample")
  @ApiOperation({ summary: "Get sample user mapping data" }) // Api operation for swagger
  @ApiResponse({
    status: HttpStatus.OK,
    type: SampleUserMappingResponse,
    isArray: true,
  }) 
  async getUserMappingSampleForSurveyConfig(
    @Res() res
  ): Promise<SampleUserMappingResponse> {
    try {
      this.logger.log(`Initiated fetching sample user mapping data.`);
      const sampleData = await this.surveyConfigService.getUserMappingSampleForSurveyConfig();
      this.logger.log(`Successfully fetched sample user mapping data.`);

      return res.status(HttpStatus.OK).json({
        message: "Kindly substitute the placeholder UUIDs with authentic and valid ones.",
        data: sampleData,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch sample user mapping data`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error); // get error message and status code

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to fetch sample user mapping data.`,
      });
    }
  }
}
