import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminCompetencyDto } from './create-admin-competency.dto';

export class UpdateAdminCompetencyDto extends PartialType(CreateAdminCompetencyDto) {}
