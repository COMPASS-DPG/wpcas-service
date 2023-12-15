import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSurveyConfigDto } from './create-survey-config.dto';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsTwoFieldsRequired } from '../../utils/custom-decorators/isTwoFieldsRequired';
import { TimeUnitsEnum } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateSurveyConfigDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    surveyName?: string;
  
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
  
    @IsOptional()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startTime?: Date;
  
    @IsOptional()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endTime?: Date;
  
    @IsOptional()
    @ApiProperty({
      type: "string" || "number",
      format: "binary",
    })
    file?: any;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    isActive?: boolean;
}
