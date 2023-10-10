import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMockRoleDto, ResponseAddCompetencyToRoleDto, ResponseMockRoleDto, UpdateMockRoleDto } from "./dto";
import { MockRoleService } from "./mock-role.service";
import { CreateCompetencyDto } from "../mock-competency/dto";

@Controller("role")
@ApiTags("mockUserService/role")
export class MockRoleController {
  constructor(private roleService: MockRoleService) {}

  @Post()
  @ApiOperation({ summary: "create new mock role" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockRoleDto })
  async createRole(@Res() res, @Body() createMockLevelDto: CreateMockRoleDto) {
    try {
      const role = await this.roleService.createRole(createMockLevelDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: role, message: "Role successfully created." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "fetch all mock roles" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseMockRoleDto,
    isArray: true,
  })
  async getAllRoles(@Res() res) {
    try {
      const roles = await this.roleService.findAllRoles();
      return res
        .status(HttpStatus.OK)
        .json({ data: roles, message: "Successfully fetched all roles." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock role by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockRoleDto })
  async findOne(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const role = await this.roleService.findRoleById(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: role, message: "Role successfully fetched." });
    } catch (error) {
      return res
        .status(error.response.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.response.message ?? "Internal server error." });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock role by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockRoleDto })
  async update(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMockRoleDto: UpdateMockRoleDto
  ) {
    try {
      const roles = await this.roleService.updateRoleById(
        id,
        updateMockRoleDto
      );
      return res
        .status(HttpStatus.OK)
        .json({ data: roles, message: "Role successfully updated." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock role by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockRoleDto })
  async remove(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const roles = await this.roleService.removeRole(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: roles, message: "Role successfully deleted." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Post("addExistingCompetencyToRole/:id")
  @ApiOperation({ summary: "add competency to role" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseAddCompetencyToRoleDto })
  async addExistingCompetencyToRole(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() competency: { competencyId: number }
  ) {
    try {
      const role = await this.roleService.addExistingCompetencyToRole(
        id,
        competency.competencyId
      );
      return res
        .status(HttpStatus.OK)
        .json({
          data: role,
          message: `Successfully added competency with id #${competency.competencyId} to Role with id #${id}.`,
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post("addNewCompetencyToRole/:id")
  @ApiOperation({ summary: "create and add competency to role" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockRoleDto })
  async addNewCompetencyToRole(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() competency: CreateCompetencyDto
  ) {
    try {
      const connection = await this.roleService.addNewCompetencyToRole(id, competency);
      return res
        .status(HttpStatus.OK)
        .json({
          data: connection,
          message: `Successfully added competency with id # to Role with id #${id}.`,
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
