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
} from "@nestjs/common";
import { SurveyConfigService } from "./survey-config.service";
import { CreateSurveyConfigDto } from "./dto/create-survey-config.dto";
import { UpdateSurveyConfigDto } from "./dto/update-survey-config.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseSurveyConfigDto } from "./dto/response-survey-config.dto";

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
  ) {
    try {
      // Log the initiation for the Survey config creation
      this.logger.log(`Creating a new survey config`);
      const createdSurveyConfig =
        await this.surveyConfigService.createSurveyConfig(
          createSurveyConfigDto
        );

      // Log the successful creation of the survey config
      this.logger.log(`Successfully created the new survey config.`);

      // Return a success response with the created request data
      return res.status(HttpStatus.CREATED).json({
        message: "Survey config created successfully",
        data: createdSurveyConfig,
      });
    } catch (error) {
       this.logger.error(
        `Failed to create new survey config.`,
        error,
      );

      // Return an error response
      return res.status(HttpStatus.CREATED).json({
        message: `Failed to create new survey config.`,
      });
    }
  }
}
