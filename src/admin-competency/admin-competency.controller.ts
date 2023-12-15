import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { AdminCompetencyService } from "./admin-competency.service";
import {
  AdminCompetencyArrayResponseDto,
  AdminCompetencyResponseDto,
} from "./dto";

@Controller("admin-competency")
@ApiTags("admin-competency")
export class AdminCompetencyController {
  private readonly logger = new Logger(AdminCompetencyController.name);

  constructor(
    private readonly adminCompetencyService: AdminCompetencyService
  ) {}

  @Post("sync-competency-data")
  @ApiOperation({ summary: "sync competency data" })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdminCompetencyResponseDto })
  async syncCompetencyData(@Res() res): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(`Initiated sync competency data`);

      const adminCompetency =
        await this.adminCompetencyService.syncCompetencyData();

      this.logger.log(`Successfully sync competency data`);

      return res.status(HttpStatus.CREATED).send({
        message: `Successfully sync competency data`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error("Failed to sync competency data", error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || "Failed to sync competency data",
      });
    }
  }

  @Get()
  @ApiOperation({ summary: "get all admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyArrayResponseDto })
  async findAll(@Res() res): Promise<AdminCompetencyArrayResponseDto> {
    try {
      this.logger.log(`Initiated fetching all admin-competency`);

      const adminCompetency = await this.adminCompetencyService.findAll();

      this.logger.log(`Successfully fetched all admin-competency`);

      return res.status(HttpStatus.OK).send({
        message: `Successfully fetched all admin-competency`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error("Failed to fetch all admin-competency", error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || "Failed to fetch all admin-competency",
      });
    }
  }


  @Get("/names")
  @ApiOperation({ summary: "get all admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyArrayResponseDto })
  async findAllCompetencyNames(@Res() res): Promise<AdminCompetencyArrayResponseDto> {
    try {
      this.logger.log(`Initiated fetching all admin-competency`);

      const adminCompetency = await this.adminCompetencyService.findAllCompetencyNames();

      this.logger.log(`Successfully fetched all admin-competency`);

      return res.status(HttpStatus.OK).send({
        message: `Successfully fetched all admin-competency`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error("Failed to fetch all admin-competency", error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || "Failed to fetch all admin-competency",
      });
    }
  }

  @Get(":competencyId")
  @ApiOperation({ summary: "get admin-competency by competencyId" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async findOne(
    @Res() res,
    @Param("competencyId", ParseIntPipe) competencyId: number
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated fetching admin-competency with competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.findOne(
        competencyId
      );

      this.logger.log(
        `Successfully fetched admin-competency with competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully fetched admin-competency with competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch admin-competency with competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to fetch admin-competency with competency id #${competencyId}`,
      });
    }
  }

  @Patch(":competencyId")
  @ApiOperation({ summary: "update admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async update(
    @Res() res,
    @Param("competencyId", ParseIntPipe) competencyId: number
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated updating admin-competency competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.update(
        competencyId
      );

      this.logger.log(
        `Successfully updated admin-competency competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully updated admin-competency competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update admin-competency competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to update admin-competency competency id #${competencyId}`,
      });
    }
  }

  @Delete(":competencyId")
  @ApiOperation({ summary: "delete admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async remove(
    @Res() res,
    @Param("competencyId", ParseIntPipe) competencyId: number
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated deleting admin-competency competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.remove(
        competencyId
      );

      this.logger.log(
        `Successfully deleted admin-competency competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully deleted admin-competency competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete admin-competency  competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to delete admin-competency  competency id #${competencyId}`,
      });
    }
  }
}
