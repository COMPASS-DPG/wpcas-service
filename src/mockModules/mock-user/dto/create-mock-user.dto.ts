import { UserRolesEnum } from "@prisma/client";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateMockUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRolesEnum, { each: true, always: true })
  @IsNotEmpty()
  role: UserRolesEnum;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @IsNotEmpty()
  @IsNumber()
  levelId: number;

  @IsNotEmpty()
  @IsNumber()
  teamId: number;

  // Optional creation date of the request.
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  // Optional update date of the request.
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
