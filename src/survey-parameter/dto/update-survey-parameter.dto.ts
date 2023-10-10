import { PartialType } from '@nestjs/swagger';
import { CreateSurveyParameterDto } from './create-survey-parameter.dto';

export class UpdateSurveyParameterDto extends PartialType(CreateSurveyParameterDto) {}
