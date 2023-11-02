import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCompetencyLevelDto } from "../mock-competency-level/dto";
import { MockCompetencyLevelService } from "../mock-competency-level/mock-competency-level.service";
import { CreateCompetencyDto, UpdateCompetencyDto } from "./dto";

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
      select: {
        id: true,
        name: true,
        description: true,
        roles: {
          select: {
            role: true,
          },
        },
        competencyLevels: {
          select: {
            competencyLevel: true,
          },
        },
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
      select: {
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
    return this.prisma.competency.update({
      where: {
        id: competencyId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        competencyLevels: {
          orderBy: {
            competencyLevel: {
              createdAt: "desc",
            },
          },
          select: {
            competencyLevel: true,
          },
        },
      },
      data: {
        competencyLevels: {
          create: {
            competencyLevel: {
              create: {
                ...createCompetencyLevel,
              },
            },
          },
        },
      },
    });
  }

  public async findCompetencyByName(competencyName: string) {
    return this.prisma.competency.findUnique({
      where: {
        name: competencyName,
      },
    });
  }

  public async findAllCompetenciesWithLevelNames() {
    return this.prisma.competency.findMany({
      include: {
        competencyLevels: {
          include: {
            competencyLevel: true,
          },
        },
      },
    });
  }
}
