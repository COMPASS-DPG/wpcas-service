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
    return await this.prisma.designation.update({
      where: {
        id,
      },
      data: {
        Roles: {
          connect: [{ id: roleId }],
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        Roles: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  async findAllRolesForDesignation(designation: string) {
    return this.prisma.designation.findUnique({
      where: {
        name: designation,
      },
      select: {
        Roles: true,
      },
    });
    
  }
}
