import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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
  async create(@Body() createMockLevelDto: CreateMockLevelDto) {
    return await this.mockLevelService.create(createMockLevelDto);
  }

  @Get()
  @ApiOperation({ summary: "get all mock level" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseMockLevelDto,
    isArray: true,
  })
  async findAll() {
    return await this.mockLevelService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async findOne(@Param("id") id: string) {
    return await this.mockLevelService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async update(
    @Param("id") id: string,
    @Body() updateMockLevelDto: UpdateMockLevelDto
  ) {
    return await this.mockLevelService.update(+id, updateMockLevelDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseMockLevelDto })
  async remove(@Param("id") id: string) {
    return await this.mockLevelService.remove(+id);
  }
}
