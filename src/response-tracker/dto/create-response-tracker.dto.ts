import { ApiProperty } from "@nestjs/swagger";
import { ResponseTrackerStatusEnum } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { AnswerEnum } from "../enums/response-tracker.enums";

export class responseObject {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({
    enum: AnswerEnum,
    example: `${AnswerEnum.YES} || ${AnswerEnum.NO} || ${AnswerEnum.DO_NOT_KNOW}`,
  })
  @IsEnum(AnswerEnum)
  @IsNotEmpty()
  answer: AnswerEnum;
}

export class CreateResponseTrackerDto {
  @ApiProperty({ type: "integer", example: 1 })
  @IsNotEmpty()
  @IsInt()
  surveyFormId: number;

  @ApiProperty({ type: "integer", example: 2 })
  @IsNotEmpty()
  @IsUUID()
  assesseeId: string;

  @ApiProperty({ type: "integer", example: 3 })
  @IsNotEmpty()
  @IsUUID()
  assessorId: string;

  @ApiProperty({
    type: responseObject,
    isArray: true,
    example: [
      {
        questionId: 1,
        answer: `${AnswerEnum.YES} || ${AnswerEnum.NO} || ${AnswerEnum.DO_NOT_KNOW}`,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => responseObject)
  responseJson?: responseObject[] = [];

  @ApiProperty({
    enum: ResponseTrackerStatusEnum,
    example:
      ResponseTrackerStatusEnum.PENDING || ResponseTrackerStatusEnum.COMPLETED,
  })
  @IsNotEmpty()
  @IsEnum(ResponseTrackerStatusEnum)
  status: ResponseTrackerStatusEnum;
}
