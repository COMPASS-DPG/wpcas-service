import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { FileUploadService } from "../file-upload/file-upload.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateSurveyConfigDto,
  SurveyConfigFilterDto,
  UserMappingFileUploadDto,
} from "./dto/create-survey-config.dto";
import { UpdateSurveyConfigDto } from "./dto/update-survey-config.dto";
import { UserMetadataService } from "../user-metadata/user-metadata.service";
import { isDateInPast } from "../utils/utils";
import { UserMappingDTO } from "./dto/response-survey-config.dto";
import { CredentialDIDService } from "src/credential-did/credential-did.service";

@Injectable()
export class SurveyConfigService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
    @Inject(forwardRef(() => UserMetadataService))
    private userMetadataService: UserMetadataService,
    private credentialService: CredentialDIDService
  ) {}
  async createSurveyConfig(
    filepath,
    createSurveyConfigDto: CreateSurveyConfigDto
  ) {
    let newConfig;
    let userIdList: Set<string> = new Set();
    try {
      await this.credentialService.findDIDs();
      await this.prisma.$transaction(async (prismaClient) => {
        newConfig = await prismaClient.surveyConfig.create({
          data: {
            surveyName: createSurveyConfigDto.surveyName,
            endTime: createSurveyConfigDto.endTime,
            startTime: createSurveyConfigDto.startTime,
          },
        });

        const parsedData = await this.fileUploadService.parseCSV(filepath);

        for (const obj of parsedData) {
          obj.assessorIds = obj.assessorIds.replace(/\s/g, '').split(",");

          const userMapping: UserMappingFileUploadDto = obj;

          try {
            userIdList = await this.userMetadataService.validateAndFetchUserIds(
              prismaClient,
              userIdList,
              userMapping
            );
          } catch (error) {
            throw error;
          }

          await prismaClient.userMapping.create({
            data: {
              surveyConfigId: newConfig.id,
              assesseeId: userMapping.assesseeId,
              assessorIds: userMapping.assessorIds,
            },
          });
        }
      });
      await this.fileUploadService.deleteUploadedFile(filepath);
    } catch (error) {
      await this.fileUploadService.deleteUploadedFile(filepath);
      throw error;
    }

    return newConfig;
  }

  async getAllSurveyConfig(filter: SurveyConfigFilterDto) {
    const { configId, startTime, endTime, limit, offset } = filter;
    return await this.prisma.surveyConfig.findMany({
      where: {
        id: configId ?? undefined,
        startTime: startTime ?? undefined,
        endTime: endTime ?? undefined,
      },
      skip: offset ?? undefined,
      take: limit ?? undefined,
    });
  }

  async updateSurveyConfigById(
    surveyConfigId: number,
    updateSurveyConfig: UpdateSurveyConfigDto,
    filepath = null
  ) {
    let updatedConfig;
    let userIdList: Set<string> = new Set();

    const surveyConfig = await this.prisma.surveyConfig.findUnique({
      where: {
        id: surveyConfigId,
      },
    });
    if (!surveyConfig) {
      throw new NotFoundException(
        `Survey config with ID ${surveyConfigId} not found.`
      );
    }
    if (isDateInPast(new Date(surveyConfig.startTime), new Date())) {
      throw new NotAcceptableException(
        `Cannot update a survey config after the startTime has already passed.`
      );
    }

    try {
      await this.prisma.$transaction(async (prismaClient) => {
        if (filepath != null) {
          const parsedData = await this.fileUploadService.parseCSV(filepath);

          await prismaClient.userMapping.deleteMany({
            where:{
              surveyConfigId
            }
          });

          for (const obj of parsedData) {
            obj.assessorIds = obj.assessorIds.replace(/\s/g, '').split(",");

            const userMapping: UserMappingFileUploadDto = obj;

            try {
              userIdList = await this.userMetadataService.validateAndFetchUserIds(
                prismaClient,
                userIdList,
                userMapping
              );
            } catch (error) {
              throw error;
            }

            await prismaClient.userMapping.create({
              data: {
                surveyConfigId,
                assesseeId: userMapping.assesseeId,
                assessorIds: userMapping.assessorIds,
              },
            });
          }

          await this.fileUploadService.deleteUploadedFile(filepath);
        }

        updatedConfig = await this.prisma.surveyConfig.update({
          where: {
            id: surveyConfigId,
          },
          data: updateSurveyConfig,
        });
      });
      return updatedConfig;
    } catch (error) {
      if (filepath) {
        await this.fileUploadService.deleteUploadedFile(filepath);
      }
      throw error;
    }
  }

  async deleteSurveyConfig(surveyConfigId: number) {
    // Find the survey config with the provided Id and check it exists or not before deleting
    const isExisted = await this.prisma.surveyConfig.findFirst({
      where: {
        id: surveyConfigId,
      },
    });
    if (!isExisted) {
      throw new NotFoundException(
        `The survey Config ID ${surveyConfigId} doesn't exist.`
      );
    }
    // Delete a single survey configuration based on its unique identifier (id).
    const deletedSurveyConfig = await this.prisma.surveyConfig.delete({
      where: {
        id: surveyConfigId,
      },
    });
    return deletedSurveyConfig;
  }

  async deactivateSurveyConfig(surveyConfigId: number) {
    return await this.prisma.surveyConfig.update({
      where: {
        id: surveyConfigId,
      },
      data: {
        isActive: false
      },
    });
  }

  public async getUserMappingSampleForSurveyConfig(): Promise<UserMappingDTO[]> {
    return [
      {
        assesseeId: "8a98a623-2ad4-40af-bfb3-1a53051e89e9",
        assessorIds: "8e11986e-36d4-4f7d-bf5e-b436a25ee661, 53fc7f0c-8724-4cba-80b9-3f6040e3aeae",
      },
      {
        assesseeId: "8e11986e-36d4-4f7d-bf5e-b436a25ee661",
        assessorIds: "8a98a623-2ad4-40af-bfb3-1a53051e89e9, 53fc7f0c-8724-4cba-80b9-3f6040e3aeae",
      },
      {
        assesseeId: "53fc7f0c-8724-4cba-80b9-3f6040e3aeae",
        assessorIds: "8a98a623-2ad4-40af-bfb3-1a53051e89e9, 8e11986e-36d4-4f7d-bf5e-b436a25ee661",
      },
    ];
  }
}
