
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMockRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}