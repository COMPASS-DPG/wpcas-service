import { PartialType } from '@nestjs/mapped-types';
import { CreateMockUserDto } from './create-mock-user.dto';

export class UpdateMockUserDto extends PartialType(CreateMockUserDto) {}
