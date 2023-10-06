import { PartialType } from '@nestjs/mapped-types';
import { CreateMockTeamDto } from './create-mock-team.dto';

export class UpdateMockTeamDto extends PartialType(CreateMockTeamDto) {}
