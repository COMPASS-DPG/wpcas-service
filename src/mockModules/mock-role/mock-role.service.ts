import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
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
    return this.prisma.role.findMany();
  }

  public async findRoleById(id: number) {
    const role = await this.prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        competencies: {
          include:{
            competency: true,
            role: false
          }
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
      include:{
        role: true,
        competency: true
      }
    });
    return connection;
  }

  public async addNewCompetencyToRole(
    roleId: number,
    createCompetencyDto: CreateCompetencyDto
  ) {
    const role = await this.findRoleById(roleId);

    const competency = await this.competency.createCompetency(createCompetencyDto);

    const connection = await this.addExistingCompetencyToRole(role.id, competency.id);
    
    return connection;
  }
}
