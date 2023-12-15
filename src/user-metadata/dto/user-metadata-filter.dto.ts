import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UserMetadataFilterDto {
  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  isNewEmployee?: boolean;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  designation?: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  isAdmin?: boolean;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsOptional()
  offset?: number;
}
