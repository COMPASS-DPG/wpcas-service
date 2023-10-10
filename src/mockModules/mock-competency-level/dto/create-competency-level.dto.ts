
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompetencyLevelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}