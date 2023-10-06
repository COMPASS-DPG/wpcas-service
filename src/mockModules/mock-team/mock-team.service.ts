import { Injectable } from "@nestjs/common";
import { CreateMockTeamDto } from "./dto/create-mock-team.dto";
import { UpdateMockTeamDto } from "./dto/update-mock-team.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MockTeamService {
  constructor(private prisma: PrismaService) {}

  public async create(createMockTeamDto: CreateMockTeamDto) {
    return await this.prisma.team.create({
      data: createMockTeamDto,
    });
  }

  public async findAll() {
    return await this.prisma.team.findMany();
  }

  public async findOne(id: number) {
    return await this.prisma.team.findUnique({
      where: {
        id,
      },
    });
  }

  public async update(id: number, updateMockTeamDto: UpdateMockTeamDto) {
    return await this.prisma.team.update({
      where: {
        id,
      },
      data: updateMockTeamDto,
    });
  }

  public async remove(id: number) {
    return await this.prisma.team.delete({
      where: {
        id,
      },
    });
  }
}
