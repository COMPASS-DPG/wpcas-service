import { Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { getPrismaErrorStatusAndMessage } from '../utils/utils';

@Controller('survey')
export class SurveyController {
    private readonly logger = new Logger(SurveyController.name);
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @ApiOperation({ summary: "Create Survey-Forms for a department." })
  @ApiResponse({ status: HttpStatus.CREATED })
  async generateSurveyFormsForDepartment(
    @Res() res,
    @Param() departmentId: number,
  ){
    try {
      this.logger.log(`Initiated creating new survey forms for a department.`);

      const surveyForms = await this.surveyService.generateSurveyFormsForDepartment(departmentId);

      this.logger.log(`Successfully created new survey forms for a department.`);

      return res.status(HttpStatus.CREATED).json({
        data: surveyForms,
        message: `SurveyForms created successfully for depatrment with id #${departmentId}`,
      });
    } catch (error) {
      this.logger.error(`Failed to create new survey forms for depatrment with id #${departmentId}`, error);

      const { errorMessage, statusCode } = getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .json({ message: errorMessage || `Could not create survey forms for depatrment with id #${departmentId}` });
    }
  }

  @Get()
  @ApiOperation({ summary: "Get number of surveys to be filled by User." })
  @ApiResponse({ status: HttpStatus.CREATED, type: "number" })
  async getSurveysToBeFilledByUser(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ){
    try {
      this.logger.log(`Getting number of surveys to be filled by user with id #${userId}.`);

      const surveyForms = await this.surveyService.getSurveysToBeFilledByUser(userId);

      this.logger.log(`Successfully fetched the number of surveys to be filled by user with id #${userId}.`);

      return res.status(HttpStatus.CREATED).json({
        data: surveyForms,
        message: `Successfully fetched the number of surveys to be filled by user with id #${userId}.`,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch the number of surveys to be filled by user with id #${userId}.`, error);

      const { errorMessage, statusCode } = getPrismaErrorStatusAndMessage(error);
      return res
        .status(statusCode)
        .json({ message: errorMessage || `Could not fetch the number of surveys to be filled by user with id #${userId}.` });
    }
  }
}
