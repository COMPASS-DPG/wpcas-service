import { TimeUnitsEnum } from "@prisma/client";

export class ResponseSurveyConfigDto {
  readonly id: number;
  readonly surveyName: string;
  readonly onboardingTime: number;
  readonly onboardingTimeUnit: TimeUnitsEnum;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly isActive: boolean;
}

export class ConfigResponseDTO {
  readonly data: ResponseSurveyConfigDto;
  readonly message: string;
}

export class UserMappingDTO {
  assesseeId: string;
  assessorIds: string;
}

export class SampleUserMappingResponse {
  data: UserMappingDTO[];
  message: string;
}
