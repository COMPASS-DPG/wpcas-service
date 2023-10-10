import { TimeUnitsEnum } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { IsSwaggerEnum } from "src/utils/decorator";

// CreateSurveyParameterDto is used to create a new survey parameter
export class CreateSurveyParameterDto {
  // Onboarding time for the survey parameter
  @IsNotEmpty()
  @IsInt()
  onboardingTime: number;

  // Onboarding time unit for the survey parameter
  @IsNotEmpty()
  @IsEnum(TimeUnitsEnum)
  onboardingTimeUnit: TimeUnitsEnum;

  // Survey cycle value for the survey parameter
  @IsNotEmpty()
  @IsInt()
  surveyCycle: number;
}

// SurveyParameterFilterDto is used to filter the Survey parameter
export class SurveyParameterFilterDto {
  // Optional onboradingTime filter to validate if it's an integer
  @IsOptional()
  @IsInt()
  onboardingTime?: number;

  // Optional onboardingTimeUnit filter, validate that its valid TimeUnitsEnum value.
  @IsOptional()
  @IsSwaggerEnum(TimeUnitsEnum)
  @IsEnum(TimeUnitsEnum, { each: true })
  onboardingTimeUnit?: TimeUnitsEnum;

  // Optional surveyCycle filter to validate if it's an integer
  @IsOptional()
  @IsInt()
  surveyCycle?: number;

  // Optional limit for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  limit?: number = 10;

  // Optional offset for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  offset?: number = 0;
}
