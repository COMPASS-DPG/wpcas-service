import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MockTeamService } from "./mock-team.service";
import { CreateMockTeamDto } from "./dto/create-mock-team.dto";
import { UpdateMockTeamDto } from "./dto/update-mock-team.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("mockUserService/team")
@ApiTags("mockUserService/team")
export class MockTeamController {
  constructor(private readonly mockTeamService: MockTeamService) {}

  @Post()
  async create(@Body() createMockTeamDto: CreateMockTeamDto) {
    return await this.mockTeamService.create(createMockTeamDto);
  }

  @Get()
  async findAll() {
    return await this.mockTeamService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.mockTeamService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateMockTeamDto: UpdateMockTeamDto
  ) {
    return await this.mockTeamService.update(+id, updateMockTeamDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.mockTeamService.remove(+id);
  }
}
