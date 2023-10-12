import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  ParseIntPipe,
} from "@nestjs/common";
import { MockUserService } from "./mock-user.service";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseMockUserDto } from "./dto/response-mock-user.dto";

@Controller("user")
@ApiTags("mockFracService/user")
export class MockUserController {
  constructor(private readonly mockUserService: MockUserService) {}

  @Post()
  @ApiOperation({ summary: "create new mock user" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async create(@Body() createMockUserDto: CreateMockUserDto, @Res() res) {
    try {
      const user = await this.mockUserService.create(createMockUserDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "get all mock user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseMockUserDto,
    isArray: true,
  })
  async findAll(@Res() res) {
    try {
      const user = await this.mockUserService.findAll();
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async findOne(@Param("id", ParseIntPipe) id: number, @Res() res) {
    try {
      const user = await this.mockUserService.findOne(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMockUserDto: UpdateMockUserDto,
    @Res() res
  ) {
    try {
      const user = await this.mockUserService.update(id, updateMockUserDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async remove(@Param("id", ParseIntPipe) id: number, @Res() res) {
    try {
      const user = await this.mockUserService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Patch("addRoleToUser/:id")
  @ApiOperation({ summary: "add role to user by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockUserDto })
  async addRoleToUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() { roleId }: any,
    @Res() res
  ) {
    try {
      const user = await this.mockUserService.addRoleToUser(id, roleId);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get("getcompetencyData/:id")
  @ApiOperation({ summary: "get mock user's competency data by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockUserDto })
  async fetchAllCompetencyDataForUserById(@Param("id", ParseIntPipe) id: number, @Res() res) {
    try {
      const user = await this.mockUserService.fetchAllCompetencyDataForUserById(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
