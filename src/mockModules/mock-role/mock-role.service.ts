import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMockRoleDto, UpdateMockRoleDto } from "./dto";
import { MockCompetencyService } from "../mock-competency/mock-competency.service";
import { CreateCompetencyDto } from "../mock-competency/dto";

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
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        competencies: {
          select: {
            competency: {
              select: {
                id: true,
                name: true,
                competencyLevels: {
                  select: {
                    competencyLevel: {
                      select: {
                        id: true,
                        name: true,
                        levelNumber: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    const transformedRoles = this.transformRolesObject(roles);

    return { roles: transformedRoles };
  }

  public async findRolesByUserId(userId: string) {
    const user = await this.prisma.userMetadata.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new Error("User data not found.");
    }
    if (!user.designation) {
      throw new Error("User does not have any designation");
    }

    const response = await this.prisma.designation.findUnique({
      where: {
        name: user.designation,
      },
      select: {
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                competencies: {
                  select: {
                    competency: {
                      select: {
                        id: true,
                        name: true,
                        competencyLevels: {
                          select: {
                            competencyLevel: {
                              select: {
                                id: true,
                                name: true,
                                levelNumber: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!response) {
      throw new Error(
        `No roles found for the user(designation: ${user.designation}) with id: ${userId}`
      );
    }
    const roles = response.roles.map((item) => item.role);
    const transformedRoles = this.transformRolesObject(roles);

    return { roles: transformedRoles };
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
      },
    });
  }

  public transformRolesObject(roles) {
    const transformedRoles: any = [];
    roles.map(async (role) => {
      const transformedRole = {
        id: role.id,
        name: role.name,
        description: role.description,
        competency: role.competencies.map((competency) => ({
          id: competency.competency.id,
          name: competency.competency.name,
          levels: competency.competency.competencyLevels.map((level) => ({
            id: level.competencyLevel.id,
            name: level.competencyLevel.name,
            levelNumber: level.competencyLevel.levelNumber,
          })),
        })),
      };
      transformedRoles.push(transformedRole);
    });

    return transformedRoles;
  }
}
