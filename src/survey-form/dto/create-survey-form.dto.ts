import { ApiProperty } from "@nestjs/swagger";
import { SurveyStatusEnum } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class responseObject {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  question: string;
}
export class CreateSurveyFormDto {
  @ApiProperty({ type: "integer", example: 1 })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  surveyConfigId: number;

  @ApiProperty({ enum: SurveyStatusEnum, example: "CREATED" })
  @IsEnum(SurveyStatusEnum)
  @IsNotEmpty()
  status: SurveyStatusEnum;

  @ApiProperty({
    type: "array",
    example: [{ questionId: 1, question: "Is this a dummy question?" }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => responseObject)
  questionsJson: responseObject[];
}
