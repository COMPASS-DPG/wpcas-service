import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyScoreDto } from './create-survey-score.dto';

export class UpdateSurveyScoreDto extends PartialType(CreateSurveyScoreDto) {}
