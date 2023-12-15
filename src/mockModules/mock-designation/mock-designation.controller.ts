import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { MockDesignationService } from "./mock-designation.service";
import {
  CreateDesignationDto,
  ResponseDesignationDto,
  UpdateDesignationDto,
} from "./dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("designation")
@ApiTags("mockFracService/designation")
export class MockDesignationController {
  constructor(private readonly designationService: MockDesignationService) {}

  @Post()
  @ApiOperation({ summary: "Create mock designation." })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseDesignationDto })
  async create(@Body() createDto: CreateDesignationDto, @Res() res) {
    try {
      const designation = await this.designationService.createDesignation(
        createDto
      );
      return res.status(HttpStatus.CREATED).json({
        data: designation,
        message: "Successfully created the Designation",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "Fetch all mock designations." })
  @ApiResponse({ status: HttpStatus.FOUND, type: ResponseDesignationDto, isArray: true })
  async findAll(@Res() res): Promise<ResponseDesignationDto[]> {
    try {
      const designation = await this.designationService.findAllDesignations();
      return res.status(HttpStatus.FOUND).json({
        data: designation,
        message: "Successfully Fetched all the designations.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Fetch mock designation by id." })
  @ApiResponse({ status: HttpStatus.FOUND, type: ResponseDesignationDto})
  async findOne(@Param("id") id: number, @Res() res) {
    try {
      const designation = await this.designationService.findDesignationById(id);
      return res.status(HttpStatus.FOUND).json({
        data: designation,
        message: "Successfully Fetched the designation.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update mock designation by id." })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseDesignationDto})
  async update(
    @Param("id") id: number,
    @Body() updateDto: UpdateDesignationDto,
    @Res() res
  ) {
    try {
      const designation = await this.designationService.updateDesignation(
        id,
        updateDto
      );
      return res.status(HttpStatus.OK).json({
        data: designation,
        message: "Successfully updated the designation.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete mock designation by id." })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseDesignationDto})
  async remove(@Param("id") id: number, @Res() res) {
    try {
      const designation = await this.designationService.removeDesignation(id);
      return res.status(HttpStatus.OK).json({
        data: designation,
        message: "Successfully deleted the designation.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Post("addRoleToDesignation/:id")
  @ApiOperation({ summary: "Add a Role to mock designation." })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseDesignationDto})
  async addRoleToDesignation(@Param("id") id: number, @Res() res, @Body() {roleId}: any) {
    try {
      const designation = await this.designationService.addRoleToDesignation(id, roleId);
      return res.status(HttpStatus.OK).json({
        data: designation,
        message: `Successfully added role with id #${roleId} to the designation with id #${id}.`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
