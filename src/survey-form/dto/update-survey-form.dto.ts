import { ApiProperty } from "@nestjs/swagger";
import { SurveyStatusEnum } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateSurveyFormDto {
  @ApiProperty({ enum: SurveyStatusEnum, example: "CREATED" })
  @IsEnum(SurveyStatusEnum)
  @IsNotEmpty()
  status: SurveyStatusEnum;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  overallScore: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  sunbirdCredentialIds: string;
}

export class UpdateSurveyFormStatusDto {
  @ApiProperty({ enum: SurveyStatusEnum, example: "CREATED" })
  @IsEnum(SurveyStatusEnum)
  @IsNotEmpty()
  status: SurveyStatusEnum;
}
