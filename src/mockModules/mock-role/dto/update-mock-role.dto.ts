import { PartialType } from '@nestjs/mapped-types';
import { CreateMockRoleDto } from './create-mock-role.dto';

export class UpdateMockRoleDto extends PartialType(CreateMockRoleDto) {}