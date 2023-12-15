import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { AnswerEnum } from "../enums/response-tracker.enums";
import { responseObject } from "./create-response-tracker.dto";

export class UpdateResponseTrackerDto {
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
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => responseObject)
  responseJson: responseObject[] = [];
}
