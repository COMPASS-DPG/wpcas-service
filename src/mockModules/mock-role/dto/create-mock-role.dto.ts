import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMockRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class AddCompetencyDto {
  @IsNotEmpty()
  @IsNumber()
  competencyId: number;
}
