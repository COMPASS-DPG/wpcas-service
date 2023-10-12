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
import { MockCompetencyLevelService } from "./mock-competency-level.service";
import {
  CreateCompetencyLevelDto,
  ResponseCompetencyLevelDto,
  UpdateCompetencyLevelDto,
} from "./dto";

@Controller("competency-level")
@ApiTags("mockFracService/competency-level")
export class MockCompetencyLevelController {
  constructor(private competencyLevelService: MockCompetencyLevelService) {}
  @Post()
  @ApiOperation({ summary: "create new mock competency-level" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ResponseCompetencyLevelDto })
  async createCompetencyLevel(
    @Res() res,
    @Body() createCompetencyLevelDto: CreateCompetencyLevelDto
  ) {
    try {
      const competency =
        await this.competencyLevelService.createCompetencyLevel(
          createCompetencyLevelDto
        );
      return res.status(HttpStatus.OK).json({
        data: competency,
        message: "CompetencyLevel successfully created.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "fetch all mock competency-levels" })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseCompetencyLevelDto,
    isArray: true,
  })
  async getAllCompetencyLevels(@Res() res) {
    try {
      const competency =
        await this.competencyLevelService.findAllCompetencyLevels();
      return res.status(HttpStatus.OK).json({
        data: competency,
        message: "CompetencyLevels successfully fetched.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock competency-level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseCompetencyLevelDto })
  async findOneCompetencyLevel(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ) {
    try {
      const competency =
        await this.competencyLevelService.findCompetencyLevelById(id);
      return res.status(HttpStatus.OK).json({
        data: competency,
        message: "CompetencyLevel successfully fetched.",
      });
    } catch (error) {
      return res
        .status(error.response.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.response.message ?? "Internal server error." });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock competency-level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseCompetencyLevelDto })
  async updateCompetencyLevel(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMockCompetencyLevelDto: UpdateCompetencyLevelDto
  ) {
    try {
      const competency =
        await this.competencyLevelService.updateCompetencyLevelById(
          id,
          updateMockCompetencyLevelDto
        );
      return res.status(HttpStatus.OK).json({
        data: competency,
        message: "CompetencyLevels successfully updated.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock competency-level by id" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseCompetencyLevelDto })
  async removeCompetencyLevel(
    @Res() res,
    @Param("id", ParseIntPipe) id: number
  ) {
    try {
      const competency =
        await this.competencyLevelService.removeCompetencyLevel(id);
      return res.status(HttpStatus.OK).json({
        data: competency,
        message: "CompetencyLevels successfully deleted.",
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
