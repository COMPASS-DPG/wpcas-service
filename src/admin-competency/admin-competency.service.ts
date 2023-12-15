import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import _ from "lodash";
import { MockCompetencyService } from "../mockModules/mock-competency/mock-competency.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminCompetencyService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MockCompetencyService))
    private mockCompetencyService: MockCompetencyService
  ) {}

  public async syncCompetencyData() {
    const competenciesData =
      await this.mockCompetencyService.findAllCompetenciesWithLevelNames();

    const response = await Promise.all(
      _.map(competenciesData, async (data) => {
        const adminCompetencyPayload = this.createAdminCompetencyPayload(data);

        return await this.createOrUpdateQuery(adminCompetencyPayload);
      })
    );

    return response;
  }

  public createAdminCompetencyPayload(competency) {
    const { competencyLevels, description, id, name } = competency;

    const competencyLevelData = _.map(
      competencyLevels,
      (competencyLevelData) => {
        const { levelNumber, name } =
          competencyLevelData?.competencyLevel || {};

        return {
          competencyLevelNumber: levelNumber,
          competencyLevelName: name,
        };
      }
    );

    return {
      id,
      competencyLevels: JSON.parse(JSON.stringify(competencyLevelData)),
      competencyId: id,
      name,
      description,
    };
  }

  public async createOrUpdateQuery(adminCompetencyPayload) {
    return this.prisma.adminCompetency.upsert({
      where: {
        competencyId: adminCompetencyPayload.competencyId,
      },
      update: adminCompetencyPayload,
      create: adminCompetencyPayload,
    });
  }

  public async findAll() {
    const adminCompetency = await this.prisma.adminCompetency.findMany();
    return adminCompetency;
  }

  public async findAllCompetencyNames() {
    const adminCompetencies = await this.prisma.adminCompetency.findMany({
      select: {
        competencyId: true,
        name: true,
      },
    });
    return adminCompetencies;
  }

  public async findOne(competencyId: number) {
    const adminCompetency = await this.prisma.adminCompetency.findUnique({
      where: {
        competencyId,
      },
    });

    if (!adminCompetency)
      throw new NotFoundException(
        `Admin competency with competency id #${competencyId} not found `
      );
    return adminCompetency;
  }

  public async update(competencyId: number) {
    const adminCompetencyData = await this.prisma.adminCompetency.findUnique({
      where: { competencyId },
    });

    const competencyData = await this.prisma.competency.findUnique({
      where: { id: competencyId },
      include: {
        competencyLevels: {
          include: {
            competencyLevel: true,
          },
        },
      },
    });

    if (!adminCompetencyData && !competencyData) {
      throw new Error(
        `Competency not found with competency Id #${competencyId}`
      );
    }

    if (adminCompetencyData && !competencyData) {
      await this.prisma.adminCompetency.delete({ where: { competencyId } });
      return;
    }

    if (competencyData) {
      const adminCompetencyPayload =
        this.createAdminCompetencyPayload(competencyData);

      return await this.createOrUpdateQuery(adminCompetencyPayload);
    }
  }

  public async remove(competencyId: number) {
    const adminCompetency = await this.prisma.adminCompetency.delete({
      where: {
        competencyId,
      },
    });
    return adminCompetency;
  }

  // public async fetchCompetencyLevel(competencyId:number, competencyLevelNumber: number){
  //   try {
  //     const competency = await this.findOne(competencyId);
  //     const competencyLevel = _.get(competency, "competencyLevels", []);
  //     return _.find(competencyLevel, competencyLevelNumber);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
