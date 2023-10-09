import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MockUserService {
  constructor(private prisma: PrismaService) {}

  public async create(createMockUserDto: CreateMockUserDto) {
    return await this.prisma.user.create({ data: createMockUserDto });
  }

  public async findAll() {
    return await this.prisma.user.findMany();
  }

  public async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
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
      data: updateMockUserDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
