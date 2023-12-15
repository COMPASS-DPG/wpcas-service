import { ApiProperty } from "@nestjs/swagger";
import { SurveyStatusEnum } from "@prisma/client";

export class SurveyScoreResponse {
  readonly id: number;
  readonly surveyFormId: number;
  readonly competencyId: number;
  readonly competencyLevelNumber: number;
  readonly score: number;
}

export class ResponseMessageDto {
  statusCode?: number;
  message: string;
}

export class SurveyScoreResponseDto extends ResponseMessageDto {
  data?: SurveyScoreResponse;
}

export class SurveyScoreMultipleResponseDto {
  data?: SurveyScoreResponse[];
  message: string;
  statusCode?: number;
}

export class SurveyScoresForUser {
  surveyFormId: number;
  @ApiProperty({ enum: SurveyStatusEnum, example: SurveyStatusEnum.CLOSED })
  status: SurveyStatusEnum;
  userId: string;
  overallScore: number;
  sunbirdCredentialIds: string;
  SurveyScore: SurveyScoreResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export class SurveyScoresForUserDto extends ResponseMessageDto {
  data?: SurveyScoresForUser;
}

export class AllSurveyScoresForUserDto extends ResponseMessageDto {
  data?: SurveyScoresForUser[];
}
