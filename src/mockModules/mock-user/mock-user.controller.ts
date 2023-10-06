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
import { MockUserService } from "./mock-user.service";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseMockUserDto } from "./dto/response-mock-user.dto";

@Controller("mockUserService/user")
@ApiTags("mockUserService/user")
export class MockUserController {
  constructor(private readonly mockUserService: MockUserService) {}

  @Post()
  @ApiOperation({ summary: "create new mock user" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  create(@Body() createMockUserDto: CreateMockUserDto) {
    return this.mockUserService.create(createMockUserDto);
  }

  @Get()
  @ApiOperation({ summary: "get all mock user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ResponseMockUserDto,
    isArray: true,
  })
  findAll() {
    return this.mockUserService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  findOne(@Param("id") id: string) {
    return this.mockUserService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  update(
    @Param("id") id: string,
    @Body() updateMockUserDto: UpdateMockUserDto
  ) {
    return this.mockUserService.update(+id, updateMockUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock user by id" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseMockUserDto })
  remove(@Param("id") id: string) {
    return this.mockUserService.remove(+id);
  }
}
