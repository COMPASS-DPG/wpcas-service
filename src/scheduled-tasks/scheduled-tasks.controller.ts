import { Controller, Get, HttpStatus, Logger, Param, ParseIntPipe, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ScheduledTasksService } from "./scheduled-tasks.service";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@Controller("scheduled-task")
@ApiTags("Manual endpoints for survey Starting & Completion")
export class ScheduledTaskController {
  private readonly logger = new Logger(ScheduledTaskController.name);

  constructor(private readonly scheduledTasksService: ScheduledTasksService) { }

  @Get("start-survey/:surveyConfigId")
  @ApiOperation({ summary: "Start the survey manually for the survey config" })
  async startSurvey(@Res() res, @Param("surveyConfigId", ParseIntPipe) surveyConfigId: number) {
    try {
      this.logger.log(`Initiated starting survey for surveyConfigId ${surveyConfigId}`);

      await this.scheduledTasksService.startSurveyDemo(surveyConfigId)

      this.logger.log(`Successfully started survey  for surveyConfigId ${surveyConfigId}`);

      return res.status(HttpStatus.OK).json({
        message: `Successfully started survey  for surveyConfigId ${surveyConfigId}`,
      });

    } catch (error) {
      this.logger.error(`Failed to start survey for surveyConfigId ${surveyConfigId}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to start survey for surveyConfigId ${surveyConfigId}`,
      });
    }
  }

  @Get("complete-survey/:surveyConfigId")
  @ApiOperation({ summary: "Complete the survey manually for the survey config" })
  async completeSurvey(@Res() res, @Param("surveyConfigId", ParseIntPipe) surveyConfigId: number) {
    try {
      this.logger.log(`Initiated completing survey for surveyConfigId ${surveyConfigId}`);

      await this.scheduledTasksService.completeSurveyDemo(surveyConfigId)

      this.logger.log(`Successfully completed survey  for surveyConfigId ${surveyConfigId}`);
      return res.status(HttpStatus.OK).json({
        message: `Successfully completed survey  for surveyConfigId ${surveyConfigId}`,
      });

    } catch (error) {
      this.logger.error(`Failed to complete survey for surveyConfigId ${surveyConfigId}`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to complete survey for surveyConfigId ${surveyConfigId}`,
      });
    }
  }
}