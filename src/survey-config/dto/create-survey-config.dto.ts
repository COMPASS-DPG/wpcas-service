import { ApiProperty } from "@nestjs/swagger";
import { TimeUnitsEnum } from "@prisma/client";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { UUID } from "crypto";
import { IsTwoFieldsRequired } from "../../utils/custom-decorators/isTwoFieldsRequired";

export class CreateSurveyConfigDto {

  @IsNotEmpty()
  @IsString()
  surveyName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsTwoFieldsRequired("onboardingTime", "onboardingTimeUnit")
  @IsInt()
  onboardingTime?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ enum: TimeUnitsEnum })
  @IsTwoFieldsRequired("onboardingTimeUnit", "onboardingTime")
  @IsEnum(TimeUnitsEnum, { each: true })
  onboardingTimeUnit?: TimeUnitsEnum;

  // start time for the survey config
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsTwoFieldsRequired("startTime", "endTime")
  startTime: Date;

  // end time for the survey config
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsTwoFieldsRequired("endTime", "startTime")
  endTime: Date;

  @ApiProperty({
    type: "string" || "number",
    format: "binary",
  })
  file: any;
}

// SurveyConfigFilterDto is used for filtering and paginating survey config.
export class SurveyConfigFilterDto {
  // Optional maxQuestions filter validate that its a number
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  configId?: number;

  //Optional startTime filter validate that its valid date-time value
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  startTime?: Date;

  //Optional endTime filter validate that its valid date-time value.
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  endTime?: Date;

  // Optional limit for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  limit?: number;

  // Optional offset for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  offset?: number;
}

export class UserMappingFileUploadDto {
  @IsNotEmpty()
  @IsUUID()
  assesseeId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("all", { each: true })
  assessorIds: UUID[];
}
