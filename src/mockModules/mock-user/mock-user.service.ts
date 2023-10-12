import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MockUserService {
  constructor(private prisma: PrismaService) {}

  public async create(createMockUserDto: CreateMockUserDto) {
    return await this.prisma.user.create({ 
      data: createMockUserDto,
      select:{
        ...this.userSelectObj,
      }
    });
  }

  public async findAll() {
    return await this.prisma.user.findMany({
      select: {
        ...this.userSelectObj,
      },
    });
  }

  public async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
    });
    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    return user;
  }

  public async update(id: number, updateMockUserDto: UpdateMockUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
      data: updateMockUserDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
    });
  }

  public async addRoleToUser(userId: number, roleId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      select: {
        ...this.userSelectObj,
      },
      data: {
        Roles: {
          connect: { id: roleId },
        },
      },
    });
  }

  public async fetchAllCompetencyDataForUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userName: true,
        role: true,
        Level: {
          select: {
            id: true,
            label: true,
          },
        },
        Team: {
          select: {
            id: true,
            name: true,
          },
        },
        Roles: {
          select: {
            id: true,
            name: true,
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
  }
  userSelectObj = {
    id: true,
    email: true,
    role: true,
    userName: true,
    profilePicture: true,
    createdAt: true,
    updatedAt: true,
    levelId: true,
    teamId: true,
  };
}
