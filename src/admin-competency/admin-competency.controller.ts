import {
  Body,
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
  CreateAdminCompetencyDto,
  UpdateAdminCompetencyDto,
} from "./dto";

@Controller("admin-competency")
@ApiTags("admin-competency")
export class AdminCompetencyController {
  private readonly logger = new Logger(AdminCompetencyController.name);

  constructor(
    private readonly adminCompetencyService: AdminCompetencyService
  ) {}

  @Post()
  @ApiOperation({ summary: "create new admin-competency" })
  @ApiResponse({ status: HttpStatus.CREATED, type: AdminCompetencyResponseDto })
  async create(
    @Res() res,
    @Body() createAdminCompetencyDto: CreateAdminCompetencyDto
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(`Initiated creating new admin-competency`);

      const adminCompetency = await this.adminCompetencyService.create(
        createAdminCompetencyDto
      );

      this.logger.log(`Successfully created new admin-competency`);

      return res.status(HttpStatus.CREATED).send({
        message: `Successfully created new admin-competency`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error("Failed to create new admin-competency", error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || "Failed to create new admin-competency",
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

  @Get(":id/:competencyId")
  @ApiOperation({ summary: "get admin-competency by id and competencyId" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async findOne(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Param("competencyId", ParseIntPipe) competencyId: number
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated fetching admin-competency with id #${id} and competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.findOne(
        id,
        competencyId
      );

      this.logger.log(
        `Successfully fetched admin-competency with id #${id} and competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully fetched admin-competency with id #${id} and competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch admin-competency with id #${id} and competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to fetch admin-competency with id #${id} and competency id #${competencyId}`,
      });
    }
  }

  @Patch(":id/:competencyId")
  @ApiOperation({ summary: "update admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async update(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Param("competencyId", ParseIntPipe) competencyId: number,
    @Body() updateAdminCompetencyDto: UpdateAdminCompetencyDto
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated updating admin-competency with id #${id} and competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.update(
        id,
        competencyId,
        updateAdminCompetencyDto
      );

      this.logger.log(
        `Successfully updated admin-competency with id #${id} and competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully updated admin-competency with id #${id} and competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to update admin-competency with id #${id} and competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to update admin-competency with id #${id} and competency id #${competencyId}`,
      });
    }
  }

  @Delete(":id/:competencyId")
  @ApiOperation({ summary: "delete admin-competency" })
  @ApiResponse({ status: HttpStatus.OK, type: AdminCompetencyResponseDto })
  async remove(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Param("competencyId", ParseIntPipe) competencyId: number
  ): Promise<AdminCompetencyResponseDto> {
    try {
      this.logger.log(
        `Initiated deleting admin-competency with id #${id} and competency id #${competencyId}`
      );

      const adminCompetency = await this.adminCompetencyService.remove(
        id,
        competencyId
      );

      this.logger.log(
        `Successfully deleted admin-competency with id #${id} and competency id #${competencyId}`
      );

      return res.status(HttpStatus.OK).send({
        message: `Successfully deleted admin-competency with id #${id} and competency id #${competencyId}`,
        data: adminCompetency,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete admin-competency  with id #${id} and competency id #${competencyId}`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage ||
          `Failed to delete admin-competency  with id #${id} and competency id #${competencyId}`,
      });
    }
  }
}
