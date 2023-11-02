import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
  HttpStatus,
  Res,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { AdminDepartmentService } from "./admin-department.service";
import { FilterAdminDepartmentsDto } from "./dto/create-admin-department.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseAdminDepartmentDto } from "./dto/response-admin-department.dto";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";

@Controller("admin-department")
@ApiTags("admin-department")
export class AdminDepartmentController {
  // Create a logger instance for this controller to log events and errors.
  private readonly logger = new Logger(AdminDepartmentController.name);

  // The Admin department controller class, injecting the Admin department service.
  constructor(
    private readonly adminDepartmentService: AdminDepartmentService
  ) {}

  // Api for creating or updating a admin department using departmentId
  @Post(":departmentId")
  @ApiOperation({ summary: "Create or update admin department" }) // Api operation for swagger
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseAdminDepartmentDto }) // Api response for the swagger
  async createOrUpdateAdminDepartment(
    @Res() res,
    @Param("departmentId", ParseIntPipe) departmentId: number
  ): Promise<ResponseAdminDepartmentDto> {
    try {
      // Log the initiation for the admin department creation
      this.logger.log(`Initiate to create a admin department`);

      const createdOrUpdatedAdminDepartment =
        await this.adminDepartmentService.createOrUpdateAdminDepartment(
          departmentId
        );
      // Log the successful creation of the admin department
      this.logger.log(`Successfully created admin department.`);
      return res.status(HttpStatus.CREATED).json({
        message: "Admin department created or updated sucessfully.",
        data: createdOrUpdatedAdminDepartment,
      });
    } catch (error) {
      this.logger.error(`Failed to create or update admin department.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create or update admin department.`,
      });
    }
  }

  // Api for getting all admin department
  @Get()
  @ApiOperation({ summary: "Fetch all admin departments." })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseAdminDepartmentDto,
    isArray: true,
  })
  async getAllAdminDepartment(
    @Res() res,
    @Query() filter: FilterAdminDepartmentsDto
  ): Promise<ResponseAdminDepartmentDto[]> {
    try {
      // Log the initiation for fetching all the admin department
      this.logger.log(`Initiated fetching all the admin department.`);
      const adminDepartments =
        await this.adminDepartmentService.getAllAdminDepartment(filter);

      // Log the successful fetching of data from db.
      this.logger.log(`Successfully fetched all admin department.`);

      // return the successful response for fetching the data from the db.
      return res.status(HttpStatus.OK).json({
        message: "Successfully fetched all admin department.",
        data: adminDepartments,
      });
    } catch (error) {
      // log the error message
      this.logger.error(`Failed to get all admin department.`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to get all admin department.`,
      });
    }
  }
}
