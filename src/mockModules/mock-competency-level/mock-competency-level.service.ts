import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCompetencyLevelDto, UpdateCompetencyLevelDto } from "./dto";

@Injectable()
export class MockCompetencyLevelService {
  constructor(private prisma: PrismaService) {}
  public async createCompetencyLevel(
    createCompetencyLevelDto: CreateCompetencyLevelDto
  ) {
    return this.prisma.competencyLevel.create({
      data: createCompetencyLevelDto,
    });
  }

  public async findAllCompetencyLevels() {
    return this.prisma.competencyLevel.findMany();
  }

  public async findCompetencyLevelById(id: number) {
    const competencyLevel = await this.prisma.competencyLevel.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        competencies: {
          select: {
            competency: true,
          },
        },
      },
    });
    if (!competencyLevel)
      throw new NotFoundException(`CompetencyLevel with id #${id} not found`);
    return competencyLevel;
  }

  public async updateCompetencyLevelById(
    id: number,
    updateCompetencyLevelDto: UpdateCompetencyLevelDto
  ) {
    return this.prisma.competencyLevel.update({
      where: {
        id,
      },
      data: updateCompetencyLevelDto,
    });
  }

  public async removeCompetencyLevel(id: number) {
    return this.prisma.competencyLevel.delete({
      where: {
        id,
      },
    });
  }
}
