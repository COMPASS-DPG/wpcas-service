import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { TimeUnitsEnum, UserRolesEnum } from "@prisma/client";
import _ from "lodash";
import { MockUserService } from "../mockModules/mock-user/mock-user.service";
import { PrismaService } from "../prisma/prisma.service";
import { SurveyConfigService } from "../survey-config/survey-config.service";
import { UserMetadataFilterDto } from "./dto";
import { UserMappingFileUploadDto } from "../survey-config/dto/create-survey-config.dto";
import { SurveyService } from "../survey/survey.service";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { TarentoService } from "src/external-services/tarento/tarento.service";
import { convertToISODateTime } from "src/utils/utils";

@Injectable()
export class UserMetadataService {
  constructor(
    private prisma: PrismaService,
    private mockUser: MockUserService,
    @Inject(forwardRef(() => SurveyConfigService))
    private surveyConfig: SurveyConfigService,
    @Inject(forwardRef(() => SurveyService))
    private surveyService: SurveyService,
    private surveyForm: SurveyFormService,
    private tarentoService: TarentoService
  ) {}

  public async syncUserDataWithFrac() {
    // fetch all users
    let users = await this.tarentoService.getAllUsers();
    let userCount = 0;

    // update or create data in user metadata table
    const usersMetaDataPayload = await Promise.all(
      users.map(async (user) => {
        try {
          const isAdmin = user.organisations[0]?.roles.includes("ADMIN") ?? false;

          const designation = 
            user.profileDetails?.professionalDetails?.length > 0 
              ? user.profileDetails?.professionalDetails[0]?.designation 
              : "";
              
          const dateOfJoining = 
            user.profileDetails?.professionalDetails?.length > 0
              ? user.profileDetails?.professionalDetails[0]?.doj 
              : user.createdDate;
              
          const dateOfJoiningISO = await convertToISODateTime(dateOfJoining);

          const userMetadataPayload = {
            userId: user.id,
            userName: user.userName,
            designation,
            isNewEmployee: false,
            dateOfJoining: dateOfJoiningISO,
            isAdmin,
            profilePicture: user?.profilePicture ?? "",
          };

          userCount++;
          console.log("userData: ", {
            userName: user.userName,
            designation: designation,
            userCount: userCount,
          });

          // Upsert user metadata in Prisma
          return await this.prisma.userMetadata.upsert({
            where: { userId: userMetadataPayload.userId },
            create: userMetadataPayload,
            update: userMetadataPayload,
          });
        } catch (error) {
          console.error(`Error upserting user metadata for user ID ${user.id}:`, error);
          // Return null or any specific value to indicate that upsert failed for this user
          return null;
        }
      })
    );

    // Filter out any null values (failed upserts) from the results
    const successfulUpserts = usersMetaDataPayload.filter(
      (result) => result !== null
    );

    return successfulUpserts;
  }

  async createOrUpdateUserMetadata(userId: string) {
    let userMetadata = await this.prisma.userMetadata.findUnique({
      where: { userId },
      select: this.metadataSelect,
    });
    // const user = await this.mockUser.findOne(userId);
    let response = await this.tarentoService.getUser(userId);

    const user = {
      id: response.data.result?.response?.content[0]?.id,
      userName: response.data.result?.response?.content[0].userName,
      createdAt: response.data.result?.response?.content[0]?.createdDate,
      role:
        response.data.result?.response?.content[0]?.organisations[0]?.roles.indexOf(
          "ADMIN"
        ) != -1
          ? "ADMIN"
          : "", // user service has "roles" for every user
      profilePicture: userMetadata?.profilePicture,
      designation:
        response.data.result?.response?.content[0]?.profileDetails
          ?.professionalDetails[0]?.designation,
      dateOfJoining:
        response.data.result?.response?.content[0]?.profileDetails
          ?.professionalDetails[0]?.doj,
    };

    const userObj = {
      userId: user.id,
      userName: user.userName,
      isNewEmployee: false,
      dateOfJoining: user.dateOfJoining,
      isAdmin: user.role == "ADMIN" ? true : false,
      designation: user.designation,
      profilePicture: null, // user service doesn't store profilePicture
    };

    if (!userMetadata) {
      userMetadata = await this.prisma.userMetadata.create({
        data: userObj,
        select: this.metadataSelect,
      });
    } else {
      if (userMetadata !== userObj) {
        userMetadata = await this.prisma.userMetadata.update({
          where: { userId },
          data: {
            isNewEmployee: false,
            dateOfJoining: user.createdAt,
            isAdmin: user.role == UserRolesEnum.ADMIN ? true : false,
            designation: user.designation,
            profilePicture: user.profilePicture,
          },
          select: this.metadataSelect,
        });
      }
    }
    return userMetadata;
  }

  async findUserMetadataById(userId: string) {
    const userMetadata = await this.prisma.userMetadata.findUnique({
      where: { userId },
      select: this.metadataSelect,
    });
    if (!userMetadata)
      throw new NotFoundException(
        `UserMetadata for user with id #${userId} not found`
      );
    return userMetadata;
  }

  async findManyUserMetadata(filter: UserMetadataFilterDto) {
    const { isAdmin, isNewEmployee, designation, limit, offset } = filter;
    let users = await this.prisma.userMetadata.findMany({
      where: {
        isAdmin: isAdmin ?? undefined,
        isNewEmployee: isNewEmployee ?? undefined,
        designation: designation ?? undefined,
      },
      skip: offset ?? undefined,
      take: limit ?? undefined,
      select: this.metadataSelect,
    });
    for (const user of users) {
      const surveysToBeFilled =
        await this.surveyService.getSurveysToBeFilledByUser(user.userId);
      const surveysFilled = await this.surveyService.getSurveysFilledByUser(
        user.userId
      );
      const wpcasScore = await this.surveyForm.fetchLatestSurveyScoreByUserId(
        user.userId
      );
      user["surveysToBeFilled"] = surveysToBeFilled;
      user["surveysFilled"] = surveysFilled;
      user["wpcasScore"] = wpcasScore;
    }

    return users;
  }

  async deleteUserMetadata(userId: string) {
    return await this.prisma.userMetadata.delete({
      where: { userId },
      select: this.metadataSelect,
    });
  }

  public async isEmployeeNew(
    dateOfJoining: Date,
    configId: number
  ): Promise<boolean> {
    const surveyConfig = await this.surveyConfig.getAllSurveyConfig({
      configId,
    });

    if (surveyConfig.length == 0) return true;

    let dateToBeCompared = new Date(dateOfJoining);
    const today = new Date();
    const { onboardingTime, onboardingTimeUnit } = surveyConfig[0];

    if (onboardingTimeUnit === TimeUnitsEnum.DAY) {
      dateToBeCompared.setDate(dateToBeCompared.getDate() + onboardingTime);
    } else if (onboardingTimeUnit === TimeUnitsEnum.MONTH) {
      dateToBeCompared.setMonth(dateToBeCompared.getMonth() + onboardingTime);
    } else {
      dateToBeCompared.setFullYear(
        dateToBeCompared.getFullYear() + onboardingTime
      );
    }

    return dateToBeCompared <= today;
  }

  async getSurveyFormsByUserId(userId: string) {
    const userMetadata = await this.prisma.userMetadata.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        dateOfJoining: true,
        designation: true,
        isNewEmployee: true,
        SurveyForm: {
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            surveyConfigId: true,
            questionsJson: true,
            status: true,
            overallScore: true,
            sunbirdCredentialIds: true,
            ResponseTracker: {
              select: {
                id: true,
                Assessor: {
                  select: {
                    userId: true,
                    userName: true,
                  },
                },
                responseJson: true,
                status: true,
              },
            },
          },
        },
      },
    });
    if (!userMetadata)
      throw new NotFoundException(
        `UserMetadata for user with id #${userId} not found`
      );
    return userMetadata;
  }

  public async validateAndFetchUserIds(
    prismaClient,
    userIdList: Set<string>,
    userMapping: UserMappingFileUploadDto
  ) {
    const userValidationArray = [
      ...new Set([...userMapping.assessorIds, userMapping.assesseeId]),
    ];

    const idsNotInUserIdList: string[] = userValidationArray.filter(
      (id) => !userIdList.has(id)
    );

    for (const id of idsNotInUserIdList) {
      try {
        const user = await prismaClient.userMetadata.findUnique({
          where: { userId: id },
        });

        if (!user) {
          await this.createOrUpdateUserMetadata(id);
        }
      } catch (error) {
        throw new NotFoundException(`User with id: ${id} not found.`);
      }
    }

    return (userIdList = new Set([...userIdList, ...idsNotInUserIdList]));
  }

  metadataSelect = {
    userId: true,
    userName: true,
    dateOfJoining: true,
    isAdmin: true,
    designation: true,
    isNewEmployee: true,
    profilePicture: true,
  };
}
