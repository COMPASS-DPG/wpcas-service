import {
  IsString,
} from "class-validator";
import { SurveyScoreCredentailDto } from "src/external-services/sunbird-rc/dto";

export class AddFeedbackDto extends SurveyScoreCredentailDto {
  @IsString()
  certificateId: string;
}