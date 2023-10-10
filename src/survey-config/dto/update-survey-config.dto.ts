import { PartialType } from '@nestjs/swagger';
import { CreateSurveyConfigDto } from './create-survey-config.dto';

export class UpdateSurveyConfigDto extends PartialType(CreateSurveyConfigDto) {}
