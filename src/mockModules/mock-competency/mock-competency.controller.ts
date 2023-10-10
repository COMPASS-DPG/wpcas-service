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
import { CreateCompetencyDto, UpdateCompetencyDto } from "./dto";
import { MockCompetencyService } from "./mock-competency.service";
import { CreateCompetencyLevelDto } from "../mock-competency-level/dto";

@Controller("competency")
@ApiTags("mockUserService/competency")
export class MockCompetencyController {
  constructor(private competencyService: MockCompetencyService) {}

  @Post()
  @ApiOperation({ summary: "create new mock competency" })
  @ApiResponse({ status: HttpStatus.CREATED })
  async createCompetency(
    @Res() res,
    @Body() createCompetencyDto: CreateCompetencyDto
  ) {
    try {
      const competency = await this.competencyService.createCompetency(
        createCompetencyDto
      );
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully created.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get()
  @ApiOperation({ summary: "fetch all mock competencies" })
  @ApiResponse({ status: HttpStatus.CREATED })
  async getAllCompetencies(@Res() res) {
    try {
      const competency = await this.competencyService.findAllCompetencies();
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully created.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "get mock competency by id" })
  @ApiResponse({ status: HttpStatus.OK })
  async findOneCompetency(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const competency = await this.competencyService.findCompetencyById(id);
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully fetched.",
        });
    } catch (error) {
      return res
        .status(error.response.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.response.message ?? "Internal server error." });
    }
  }

  @Patch(":id")
  @ApiOperation({ summary: "update mock competency by id" })
  @ApiResponse({ status: HttpStatus.OK })
  async updateCompetency(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCompetencyDto: UpdateCompetencyDto
  ) {
    try {
      const competency = await this.competencyService.updatecompetencyById(
        id,
        updateCompetencyDto
      );
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully updated.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "delete mock competency by id" })
  @ApiResponse({ status: HttpStatus.OK })
  async removeCompetency(@Res() res, @Param("id", ParseIntPipe) id: number) {
    try {
      const competency = await this.competencyService.removeCompetency(id);
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully deleted.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Post("addExistingCompetencyLevelToCompetency/:id")
  @ApiOperation({ summary: "add competency level to competency" })
  @ApiResponse({ status: HttpStatus.OK })
  async addExistingCompetencyLevelToCompetency(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() competencyLevel: { competencyLevelId: number }
  ) {
    try {
      const competency =
        await this.competencyService.addExistingCompetencyLevelToCompetency(
          id,
          competencyLevel.competencyLevelId
        );
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully deleted.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }

  @Post("addNewCompetencyLevelToCompetency/:id")
  @ApiOperation({ summary: "create and add competency level to competency" })
  @ApiResponse({ status: HttpStatus.OK })
  async addNewCompetencyLevelToCompetency(
    @Res() res,
    @Param("id", ParseIntPipe) id: number,
    @Body() competencyLevel: CreateCompetencyLevelDto
  ) {
    try {
      const competency =
        await this.competencyService.addNewCompetencyLevelToCompetency(
          id,
          competencyLevel
        );
      return res
        .status(HttpStatus.OK)
        .json({
          data: competency,
          message: "Competency successfully deleted.",
        });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.meta.cause });
    }
  }
}
