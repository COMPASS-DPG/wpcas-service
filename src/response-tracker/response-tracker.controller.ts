import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  CreateResponseTrackerDto,
  ResponseTrackerDtoMultipleResponse,
  ResponseTrackerDtoResponse,
  UpdateResponseTrackerDto,
} from "./dto";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { ResponseTrackerService } from "./response-tracker.service";

@Controller("response-tracker")
@ApiTags("response-tracker")
export class ResponseTrackerController {
  private readonly logger = new Logger(ResponseTrackerController.name);
  constructor(
    private readonly responseTrackerService: ResponseTrackerService
  ) {}

  @Post()
  @ApiOperation({ summary: "create new response tracker" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseTrackerDtoResponse })
  async create(
    @Res() res,
    @Body() createResponseTrackerDto: CreateResponseTrackerDto
  ): Promise<ResponseTrackerDtoResponse> {
    try {
      this.logger.log(`Initiated creating response tracker`);

      const response = await this.responseTrackerService.create(
        createResponseTrackerDto
      );

      return res.status(HttpStatus.CREATED).json({
        data: response,
        message: "Successfully created response tracker",
      });
    } catch (error) {
      this.logger.error(`Failed to create response tracker`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create response tracker`,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: "get all response trackers" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseTrackerDtoMultipleResponse,
  })
  async findAll(@Res() res): Promise<ResponseTrackerDtoMultipleResponse> {
    try {
      this.logger.log(`Initiated fetching all response trackers`);

      const responses = await this.responseTrackerService.findAll();

      return res.status(HttpStatus.OK).json({
        data: responses,
        message: `Successfully fetched all response trackers`,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch all response trackers`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to fetch all response trackers`,
      });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get response tracker by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseTrackerDtoResponse })
  async findOne(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseTrackerDtoResponse> {
    try {
      this.logger.log(`Initiated fetching response tracker with id#${id}`);

      const response = await this.responseTrackerService.findOne(id);

      return res.status(HttpStatus.OK).json({
        data: response,
        message: `Successfully fetched response tracker for id #${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch response tracker with id #${id}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage || `Failed to fetch response tracker for id #${id}`,
      });
    }
  }

  @Get("survey-form/:surveyFormId")
  @ApiOperation({ summary: "get response trackers by surveyFormId" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseTrackerDtoMultipleResponse,
  })
  async findBySurveyFormId(
    @Res() res,
    @Param("surveyFormId", ParseIntPipe) surveyFormId: number
  ): Promise<ResponseTrackerDtoMultipleResponse> {
    try {
      this.logger.log(
        `Initiated fetching response tracker with surveyFormId#${surveyFormId}`
      );

      const response = await this.responseTrackerService.findBySurveyFormId(
        surveyFormId
      );

      return res.status(HttpStatus.OK).json({
        data: response,
        message: `Successfully fetched response tracker for surveyFormId #${surveyFormId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch response tracker with surveyFormId #${surveyFormId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to fetch response tracker for surveyFormId #${surveyFormId}`,
      });
    }
  }

  @Get("assessor/:assessorId")
  @ApiOperation({
    summary: "get response tracker by assessorId",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseTrackerDtoMultipleResponse,
  })
  async findByAssessorId(
    @Res() res,
    @Param("assessorId", ParseUUIDPipe) assessorId: string
  ): Promise<ResponseTrackerDtoMultipleResponse> {
    try {
      this.logger.log(
        `Initiated fetching response tracker with assessorId#${assessorId}.`
      );

      const response = await this.responseTrackerService.findByAssessorId(
        assessorId
      );

      this.logger.log(
        `Successfully fetched response tracker for assessorId #${assessorId}.`
      );

      return res.status(HttpStatus.OK).json({
        data: response,
        message: `Successfully fetched response tracker for assessorId #${assessorId}.`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch response tracker with assessorId #${assessorId}.`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to fetch response tracker for assessorId #${assessorId}.`,
      });
    }
  }

  @Get("assessee/:assesseeId/:surveyFormId")
  @ApiOperation({
    summary: "get response tracker by assesseeId & surveyFormId",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseTrackerDtoMultipleResponse,
  })
  async findByAssesseeId(
    @Res() res,
    @Param("assesseeId", ParseUUIDPipe) assesseeId: string,
    @Param("surveyFormId", ParseIntPipe) surveyFormId: number
  ): Promise<ResponseTrackerDtoMultipleResponse> {
    try {
      this.logger.log(
        `Initiated fetching response tracker with assesseeId#${assesseeId} and surveyFormId #${surveyFormId}`
      );

      const response =
        await this.responseTrackerService.findByAssesseeIdAndSurveyFormId(
          assesseeId,
          surveyFormId
        );

      return res.status(HttpStatus.OK).json({
        data: response,
        message: `Successfully fetched response tracker for assesseeId #${assesseeId} and surveyFormId ${surveyFormId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch response tracker with assesseeId #${assesseeId} and surveyFormId #${surveyFormId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to fetch response tracker for assesseeId #${assesseeId} and surveyFormId #${surveyFormId}`,
      });
    }
  }

  @Patch()
  @ApiOperation({
    summary:
      "update response tracker by surveyFormId, assesseeId and assessorId",
  })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseTrackerDtoResponse })
  async update(
    @Res() res,
    @Body() updateResponseTrackerDto: UpdateResponseTrackerDto
  ): Promise<ResponseTrackerDtoResponse> {
    const { surveyFormId, assesseeId, assessorId } = updateResponseTrackerDto;
    try {
      this.logger.log(
        `Initiated updating response tracker with surveyFormId #${surveyFormId}, assesseeId #${assesseeId} and assessorId #${assessorId}`
      );

      const updatedResponse =
        await this.responseTrackerService.updateBySurveyFormId(
          updateResponseTrackerDto
        );

      return res.status(HttpStatus.OK).json({
        data: updatedResponse,
        message: `Successfully updated response tracker with surveyFormId ${surveyFormId}, assesseeId #${assesseeId} and assessorId #${assessorId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update response tracker with surveyFormId #${surveyFormId}, assesseeId #${assesseeId} and assessorId #${assessorId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to update response tracker with surveyFormId #${surveyFormId}, assesseeId #${assesseeId} and assessorId #${assessorId}`,
      });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete response tracker by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseTrackerDtoResponse })
  async remove(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ): Promise<ResponseTrackerDtoResponse> {
    try {
      this.logger.log(`Initiated deleting response tracker with id #${id}`);

      await this.responseTrackerService.remove(id);

      return res.status(HttpStatus.OK).json({
        message: `Successfully deleted response tracker with id ${id}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete response tracker with id #${id}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage || `Failed to delete response tracker with id #${id}`,
      });
    }
  }
}
