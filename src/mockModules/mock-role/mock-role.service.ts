import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMockRoleDto, UpdateMockRoleDto } from "./dto";
import { MockCompetencyService } from "../mock-competency/mock-competency.service";
import { CreateCompetencyDto } from "../mock-competency/dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class MockRoleService {
  constructor(
    private prisma: PrismaService,
    private competency: MockCompetencyService
  ) {}
  public async createRole(createMockRoleDto: CreateMockRoleDto) {
    return this.prisma.role.create({
      data: createMockRoleDto,
    });
  }

  public async findAllRoles() {
    return this.prisma.role.findMany();
  }

  public async findRoleById(id: number) {
    const role = await this.prisma.role.findUnique({
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
            competencyId: true,
          },
        },
      },
    });
    if (!role) throw new NotFoundException(`Role with id #${id} not found`);
    return role;
  }

  public async updateRoleById(
    id: number,
    updateMockRoleDto: UpdateMockRoleDto
  ) {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: updateMockRoleDto,
    });
  }

  public async removeRole(id: number) {
    return this.prisma.role.delete({
      where: {
        id,
      },
    });
  }

  public async addExistingCompetencyToRole(
    roleId: number,
    competencyId: number
  ) {
    const role = await this.findRoleById(roleId);

    const competency = await this.competency.findCompetencyById(competencyId);

    const connection = await this.prisma.roleToCompetency.create({
      data: {
        roleId: role.id,
        competencyId: competency.id,
      },
      select: {
        role: true,
        competency: true,
      },
    });
    return connection;
  }

  public async addNewCompetencyToRole(
    roleId: number,
    createCompetencyDto: CreateCompetencyDto
  ) {
    return this.prisma.role.update({
      where: {
        id: roleId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        competencies: {
          orderBy: {
            competency: {
              createdAt: "desc",
            },
          },
          select: {
            competency: true,
          },
        },
      },
      data: {
        competencies: {
          create: {
            competency: {
              create: {
                ...createCompetencyDto,
              },
            },
          },
        },
      },
    });
  }

  public async getCompetenciesByRoleId(id: number) {
    return this.prisma.roleToCompetency.findMany({
      where: {
        roleId: id,
      },
      select: {
        competencyId: true,
      }
    });
  }
}
