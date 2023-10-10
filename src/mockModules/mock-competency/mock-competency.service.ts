import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCompetencyDto, UpdateCompetencyDto } from "./dto";
import { MockCompetencyLevelService } from "../mock-competency-level/mock-competency-level.service";
import { CreateCompetencyLevelDto } from "../mock-competency-level/dto";

@Injectable()
export class MockCompetencyService {
  constructor(
    private prisma: PrismaService,
    private competencyLevelService: MockCompetencyLevelService
  ) {}
  public async createCompetency(createMockRoleDto: CreateCompetencyDto) {
    return this.prisma.competency.create({
      data: createMockRoleDto,
    });
  }

  public async findAllCompetencies() {
    return this.prisma.competency.findMany();
  }

  public async findCompetencyById(id: number) {
    const competency = await this.prisma.competency.findUnique({
      where: {
        id,
      },
      include: {
        competencyLevels: true,
        roles: true,
      },
    });
    if (!competency)
      throw new NotFoundException(`Competency with id #${id} not found`);
    return competency;
  }

  public async updatecompetencyById(
    id: number,
    updateCompetencyDto: UpdateCompetencyDto
  ) {
    return this.prisma.competency.update({
      where: {
        id,
      },
      data: updateCompetencyDto,
    });
  }

  public async removeCompetency(id: number) {
    return this.prisma.competency.delete({
      where: {
        id,
      },
    });
  }

  public async addExistingCompetencyLevelToCompetency(
    competencyId: number,
    competencyLevelId: number
  ) {
    const competency = await this.findCompetencyById(competencyId);
    const competencyLevel =
      await this.competencyLevelService.findCompetencyLevelById(
        competencyLevelId
      );
    const connection = await this.prisma.competencyToCompetencyLevel.create({
      data: {
        competencyId: competency.id,
        competencyLevelId: competencyLevel.id,
      },
      include: {
        competency: true,
        competencyLevel: true,
      },
    });
    return connection;
  }

  public async addNewCompetencyLevelToCompetency(
    competencyId: number,
    createCompetencyLevel: CreateCompetencyLevelDto
  ) {
    const competency = await this.findCompetencyById(competencyId);

    const competencyLevel =
      await this.competencyLevelService.createCompetencyLevel(
        createCompetencyLevel
      );

    const connection = await this.addExistingCompetencyLevelToCompetency(
      competency.id,
      competencyLevel.id
    );

    return connection;
  }
}
