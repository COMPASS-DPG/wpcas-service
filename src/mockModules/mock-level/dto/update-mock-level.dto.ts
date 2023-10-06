import { PartialType } from '@nestjs/mapped-types';
import { CreateMockLevelDto } from './create-mock-level.dto';

export class UpdateMockLevelDto extends PartialType(CreateMockLevelDto) {}
