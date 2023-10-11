import { TimeUnitsEnum } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";

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
