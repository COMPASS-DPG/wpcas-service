import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAdminCompetencyDto, UpdateAdminCompetencyDto } from "./dto";

@Injectable()
export class AdminCompetencyService {
  constructor(private prisma: PrismaService) {}

  public async create(createAdminCompetencyDto: CreateAdminCompetencyDto) {
    const competencyLevels = JSON.stringify(
      createAdminCompetencyDto.competencyLevels
    );

    const payload = {
      ...createAdminCompetencyDto,
      competencyLevels: JSON.parse(competencyLevels),
    };

    return await this.prisma.adminCompetency.create({
      data: payload,
    });
  }

  public async findAll() {
    const adminCompetency = await this.prisma.adminCompetency.findMany();
    return adminCompetency;
  }

  public async findOne(id: number, competencyId: number) {
    const adminCompetency = await this.prisma.adminCompetency.findUnique({
      where: {
        id_competencyId: {
          id,
          competencyId,
        },
      },
    });
    if (!adminCompetency)
      throw new NotFoundException(
        `Admin competency with id #${id} and competency id #${competencyId} not found `
      );
    return adminCompetency;
  }

  public async update(
    id: number,
    competencyId: number,
    updateAdminCompetencyDto: UpdateAdminCompetencyDto
  ) {
    const competencyLevels = JSON.stringify(
      updateAdminCompetencyDto?.competencyLevels
    );

    let payload = {
      ...updateAdminCompetencyDto,
      competencyLevels: JSON.parse(competencyLevels || "[]"),
    };

    if (!competencyLevels) {
      delete payload.competencyLevels;
    }

    return await this.prisma.adminCompetency.update({
      where: {
        id_competencyId: {
          id,
          competencyId,
        },
      },
      data: payload,
    });
  }

  public async remove(id: number, competencyId: number) {
    const adminCompetency = await this.prisma.adminCompetency.delete({
      where: {
        id_competencyId: {
          id,
          competencyId,
        },
      },
    });
    return adminCompetency;
  }
}
