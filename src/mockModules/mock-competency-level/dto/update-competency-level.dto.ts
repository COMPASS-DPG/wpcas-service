import { PartialType } from '@nestjs/mapped-types';
import { CreateCompetencyLevelDto } from './create-competency-level.dto';

export class UpdateCompetencyLevelDto extends PartialType(CreateCompetencyLevelDto) {}