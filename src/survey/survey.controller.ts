import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";
import { SurveyService } from "./survey.service";
import { ResponseSurveyFormDto, SurveyFormResponse } from "../survey-form/dto";
import { HomeScreenAPIResponse } from "./dto";

@Controller("survey")
@ApiTags("survey")
export class SurveyController {
  private readonly logger = new Logger(SurveyController.name);
  constructor(private readonly surveyService: SurveyService) {}

  @Post(":configId")
  @ApiOperation({ summary: "Create Survey-Forms for a SurveyConfig." })
  @ApiResponse({ status: HttpStatus.CREATED })
  async generateSurveyFormsForSurveyConfig(
    @Res() res,
    @Param("configId", ParseIntPipe) configId: number
  ) {
    try {
      this.logger.log(
        `Initiated creating new survey forms for a Survey Config.`
      );

      const surveyForms =
        await this.surveyService.generateSurveyFormsForSurveyConfig(configId);

      this.logger.log(
        `Successfully created new survey forms for a Survey Config.`
      );

      return res.status(HttpStatus.CREATED).json({
        data: surveyForms,
        message: `SurveyForms created successfully for Survey Config with id #${configId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to create new survey forms for Survey Config with id #${configId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res.status(statusCode).json({
        message:
          errorMessage ||
          `Could not create survey forms for Survey Config with id #${configId}`,
      });
    }
  }

  @Get("user-filled-survey/:userId")
  @ApiOperation({ summary: "Get number of surveys to be filled by User." })
  @ApiResponse({ status: HttpStatus.OK, type: "number" })
  async getSurveysToBeFilledByUser(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<{ data: number; message: string }> {
    try {
      this.logger.log(
        `Getting number of surveys to be filled by user with id #${userId}.`
      );

      const surveyForms = await this.surveyService.getSurveysToBeFilledByUser(
        userId
      );

      this.logger.log(
        `Successfully fetched the number of surveys to be filled by user with id #${userId}.`
      );

      return res.status(HttpStatus.OK).json({
        data: surveyForms,
        message: `Successfully fetched the number of surveys to be filled by user with id #${userId}.`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch the number of surveys to be filled by user with id #${userId}.`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res.status(statusCode).json({
        message:
          errorMessage ||
          `Could not fetch the number of surveys to be filled by user with id #${userId}.`,
      });
    }
  }

  @Get("latest-survey-response/:userId")
  @ApiOperation({ summary: "Fetch latest survey response by userId" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseSurveyFormDto })
  async getLatestSurveyResponsesForUserId(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(
        `Initiated fetching latest survey response by userId #${userId}`
      );

      const surveyForm =
        await this.surveyService.getLatestSurveyResponsesForUserId(userId);

      this.logger.log(
        `Successfully fetched latest survey response by userId #${userId}`
      );

      return res.status(HttpStatus.OK).send({
        data: surveyForm,
        message: `Successfully fetched latest survey response by userId #${userId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch latest survey response by userId #${userId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res.status(statusCode).send({
        message:
          errorMessage ||
          `Could not find latest survey response by userId #${userId}`,
      });
    }
  }

  @Get("home-screen")
  @ApiOperation({ summary: "Fetch WPCAS home screen data" })
  @ApiResponse({ status: HttpStatus.OK, type: HomeScreenAPIResponse })
  async wpcasHomeScreenApi(
    @Res() res,
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(`Initiated fetching Home Screen data for WPCAS.`);

      const surveyForm = await this.surveyService.wpcasHomeScreenApi();

      this.logger.log(`Successfully fetched Home Screen data for WPCAS.`);

      return res.status(HttpStatus.OK).send({
        data: surveyForm,
        message: `Successfully fetched Home Screen data for WPCAS.`,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch Home Screen data for WPCAS.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res.status(statusCode).send({
        message: errorMessage || `Could not fetch Home Screen data for WPCAS.`,
      });
    }
  }
}
