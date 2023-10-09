import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Res,
} from "@nestjs/common";
import { MockLevelService } from "./mock-level.service";
import { CreateMockLevelDto } from "./dto/create-mock-level.dto";
import { UpdateMockLevelDto } from "./dto/update-mock-level.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseMockLevelDto } from "./dto/response-mock-level.dto";

@Controller("mockUserService/level")
@ApiTags("mockUserService/level")
export class MockLevelController {
  constructor(private readonly mockLevelService: MockLevelService) {}

  @Post()
  @ApiOperation({ summary: "create new mock level" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockLevelDto })
  async create(@Res() res, @Body() createMockLevelDto: CreateMockLevelDto) {
    try {
      const level = await this.mockLevelService.create(createMockLevelDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: level, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "get all mock level" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseMockLevelDto,
    isArray: true,
  })
  async findAll(@Res() res) {
    try {
      const level = await this.mockLevelService.findAll();
      return res
        .status(HttpStatus.OK)
        .json({ data: level, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async findOne(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const level = await this.mockLevelService.findOne(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: level, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async update(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMockLevelDto: UpdateMockLevelDto
  ) {
    try {
      const level = await this.mockLevelService.update(id, updateMockLevelDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: level, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async remove(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const level = await this.mockLevelService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: level, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
