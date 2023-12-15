import {
  IsDateString,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

class LevelCredentailDto {
  @IsInt()
  levelNumber: number;
  
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: "Score must be at least 0" })
  @Max(100, { message: "Score must not exceed 100" })
  score: number | null;
}

export class CompetencyCredentailDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @ArrayMinSize(1, { message: "Levels must have at least one item" })
  @ArrayNotEmpty({ message: "Levels must not be empty" })
  @ValidateNested({ each: true })
  @Type(() => LevelCredentailDto)
  levels: LevelCredentailDto[];
}

export class SurveyScoreCredentailDto {
  @IsDateString()
  dateOfSurveyScore: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: "Overall score must be at least 0" })
  @Max(100, { message: "Overall score must not exceed 100" })
  overallScore: number | null;

  @ArrayMinSize(1, { message: "Competencies must have at least one item" })
  @ArrayNotEmpty({ message: "Competencies must not be empty" })
  @ValidateNested({ each: true })
  @Type(() => CompetencyCredentailDto)
  competencies: CompetencyCredentailDto[];

  @IsString()
  userId: string;
}

enum CredentialStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export class createSchemaInputDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsDateString()
  @IsNotEmpty()
  authored: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(CredentialStatus)
  @IsNotEmpty()
  status: CredentialStatus;
}
