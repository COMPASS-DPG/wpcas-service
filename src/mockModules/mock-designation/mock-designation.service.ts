import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDesignationDto, UpdateDesignationDto } from "./dto";

@Injectable()
export class MockDesignationService {
  constructor(private prisma: PrismaService) {}

  async createDesignation(createDto: CreateDesignationDto) {
    return await this.prisma.designation.create({
      data: createDto,
    });
  }

  async findAllDesignations() {
    return await this.prisma.designation.findMany();
  }

  async findDesignationById(id: number) {
    return await this.prisma.designation.findUnique({
      where: { id },
    });
  }

  async findUsersWithDesignationId(id: number) {
    const designation = await this.findDesignationById(id);
    return await this.prisma.userMetadata.findMany({
      where: {
        designation: designation?.name,
      },
    });
  }

  async updateDesignation(id: number, updateDto: UpdateDesignationDto) {
    return await this.prisma.designation.update({
      where: { id },
      data: updateDto,
    });
  }

  async removeDesignation(id: number) {
    return await this.prisma.designation.delete({
      where: { id },
    });
  }

  async addRoleToDesignation(id: number, roleId: number) {
    try {
      await this.prisma.designationToRole.upsert({
        where: {
          designationId_roleId: {
            designationId: id,
            roleId: roleId,
          },
        },
        update: {
          designationId: id,
          roleId: roleId,
        },
        create: {
          designationId: id,
          roleId: roleId,
        },
      });
    } catch (error) {
      throw new Error("Error adding role to designation.");
    }

    const designation = await this.prisma.designation.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    return {
      id: designation?.id,
      name: designation?.name,
      description: designation?.description,
      Role: designation?.roles.map((item) => item.role),
    };
  }

  async findAllRolesForDesignation(designation: string) {
    const result = await this.prisma.designation.findUnique({
      where: {
        name: designation,
      },
      select: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!result) return { Roles: [] };
    const roles = result.roles.map((item) => item.role);
    return { Roles: roles };
  }
}
