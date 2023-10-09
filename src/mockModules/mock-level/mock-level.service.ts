import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMockLevelDto } from "./dto/create-mock-level.dto";
import { UpdateMockLevelDto } from "./dto/update-mock-level.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MockLevelService {
  constructor(private prisma: PrismaService) {}
  public async create(createMockLevelDto: CreateMockLevelDto) {
    return await this.prisma.level.create({
      data: createMockLevelDto,
    });
  }

  public async findAll() {
    return await this.prisma.level.findMany();
  }

  public async findOne(id: number) {
    const level = await this.prisma.level.findUnique({
      where: {
        id,
      },
    });
    if (!level) throw new NotFoundException(`Level with id #${id} not found`);
    return level;
  }

  public async update(id: number, updateMockLevelDto: UpdateMockLevelDto) {
    return await this.prisma.level.update({
      where: {
        id,
      },
      data: updateMockLevelDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.level.delete({
      where: {
        id,
      },
    });
  }
}
