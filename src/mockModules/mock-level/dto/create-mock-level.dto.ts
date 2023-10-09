import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMockLevelDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
