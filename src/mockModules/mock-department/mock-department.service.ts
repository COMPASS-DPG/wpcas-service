import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDepartmentDto } from "./dto/create-mock-department.dto";
import { UpdateDepartmentDto } from "./dto/update-mock-department.dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MockDepartmentService {
  constructor(private prisma: PrismaService) {}

  public async create(createDepartmentDto: CreateDepartmentDto) {
    return await this.prisma.department.create({
      data: createDepartmentDto,
    });
  }

  public async findAll() {
    return await this.prisma.department.findMany();
  }

  public async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });
    if (!department) throw new NotFoundException(`Department with id #${id} not found`);
    return department;
  }

  public async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return await this.prisma.department.update({
      where: {
        id,
      },
      data: updateDepartmentDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.department.delete({
      where: {
        id,
      },
    });
  }
}
