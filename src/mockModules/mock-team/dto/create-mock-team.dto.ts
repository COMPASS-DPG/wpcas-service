import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMockTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
