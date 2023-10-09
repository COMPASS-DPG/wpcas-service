import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  ParseIntPipe,
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
  async create(@Body() createMockTeamDto: CreateMockTeamDto, @Res() res) {
    try {
      const team = await this.mockTeamService.create(createMockTeamDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: team, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  async findAll(@Res() res) {
    try {
      const team = await this.mockTeamService.findAll();
      return res
        .status(HttpStatus.OK)
        .json({ data: team, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @Res() res) {
    try {
      const team = await this.mockTeamService.findOne(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: team, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Patch(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMockTeamDto: UpdateMockTeamDto,
    @Res() res
  ) {
    try {
      const team = await this.mockTeamService.update(id, updateMockTeamDto);
      return res
        .status(HttpStatus.OK)
        .json({ data: team, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number, @Res() res) {
    try {
      const team = await this.mockTeamService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ data: team, message: "Successfully done" });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
