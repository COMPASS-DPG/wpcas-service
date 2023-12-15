import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CompetencyLevels {
  @IsInt()
  @IsNotEmpty()
  competencyLevelNumber: number;

  @IsString()
  @IsNotEmpty()
  competencyLevelName: string;
}

export class CreateAdminCompetencyDto {
  @IsNotEmpty()
  @IsInt()
  competencyId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: CompetencyLevels,
    isArray: true,
    example: [{ competencyLevelNumber: 1, competencyLevelName: "Level-1" }],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompetencyLevels)
  competencyLevels: CompetencyLevels[];

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
