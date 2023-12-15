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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { ResponseMockUserDto } from "./dto/response-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { MockUserService } from "./mock-user.service";

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
        .json({ message: error?.meta?.cause || `Failed to create user` });
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

  @Get(":userId")
  @ApiOperation({ summary: "get mock user by userId" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async findOne(@Param("userId") userId: string, @Res() res) {
    try {
      const user = await this.mockUserService.findOne(userId);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(":userId")
  @ApiOperation({ summary: "update mock user by userId" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async update(
    @Param("userId") userId: string,
    @Body() updateMockUserDto: UpdateMockUserDto,
    @Res() res
  ) {
    try {
      const user = await this.mockUserService.update(userId, updateMockUserDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":userId")
  @ApiOperation({ summary: "delete mock user by userId" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  async remove(@Param("userId") userId: string, @Res() res) {
    try {
      const user = await this.mockUserService.remove(userId);
      return res
        .status(HttpStatus.OK)
        .json({ data: user, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
