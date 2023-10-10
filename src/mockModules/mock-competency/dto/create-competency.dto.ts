
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompetencyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}