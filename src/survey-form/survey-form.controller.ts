import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  Logger,
} from "@nestjs/common";
import { SurveyFormService } from "./survey-form.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateSurveyFormDto,
  SurveyFormResponse,
  UpdateSurveyFormDto,
} from "./dto";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@Controller("survey-form")
@ApiTags("survey-form")
export class SurveyFormController {
  private readonly logger = new Logger(SurveyFormController.name);
  constructor(private readonly surveyFormService: SurveyFormService) {}

  @Post()
  @ApiOperation({ summary: "Create a Survey-Form" })
  @ApiResponse({ status: HttpStatus.CREATED, type: SurveyFormResponse })
  async createSurveyForm(
    @Res() res,
    @Body() createSurveyFormDto: CreateSurveyFormDto
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(`Initiated creating new survey form`);

      const surveyForm = await this.surveyFormService.createSurveyForm(
        createSurveyFormDto
      );

      this.logger.log(`Successfully created new survey form`);

      return res.status(HttpStatus.CREATED).json({
        data: surveyForm,
        message: "SurveyForm created successfully",
      });
    } catch (error) {
      this.logger.error(`Failed to create new survey form`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .json({ message: errorMessage || "Could not create survey form" });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch a Survey-Form" })
  @ApiResponse({ status: HttpStatus.FOUND, type: SurveyFormResponse })
  async findSurveyFormById(
    @Res() res,
    @Param("id") id: number
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(`Initiated fetching new survey form`);

      const surveyForm = await this.surveyFormService.findSurveyFormById(id);

      this.logger.log(`Successfully fetched the survey form`);

      return res.status(HttpStatus.OK).send({
        data: surveyForm,
        message: "SurveyForm fetched successfully",
      });
    } catch (error) {
      this.logger.error(`Failed to fetch survey form`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .send({ message: errorMessage || "Could not find survey form" });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update the Survey-Form" })
  @ApiResponse({ status: HttpStatus.OK, type: SurveyFormResponse })
  async updateSurveyForm(
    @Res() res,
    @Param("id") id: number,
    @Body() { status }: UpdateSurveyFormDto
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(`Initiated updating new survey form`);

      const surveyForm = await this.surveyFormService.updateSurveyForm(
        id,
        status
      );

      this.logger.log(`Successfully updated the survey form`);

      return res.status(HttpStatus.OK).json({
        data: surveyForm,
        message: "SurveyForm updated successfully",
      });
    } catch (error) {
      this.logger.error(`Failed to update survey form`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .json({ message: errorMessage || "Could not update survey form" });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a Survey-Form" })
  @ApiResponse({ status: HttpStatus.OK, type: SurveyFormResponse })
  async deleteSurveyForm(
    @Res() res,
    @Param("id") id: number
  ): Promise<SurveyFormResponse> {
    try {
      this.logger.log(`Initiated deleting new survey form`);

      const surveyForm = await this.surveyFormService.deleteSurveyForm(id);

      this.logger.log(`Successfully deleted survey form`);

      return res.status(HttpStatus.OK).json({
        data: surveyForm,
        message: "SurveyForm deleted successfully",
      });
    } catch (error) {
      this.logger.error(`Failed to delete survey form`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .json({ message: errorMessage || "Could not delete survey form." });
    }
  }
}
