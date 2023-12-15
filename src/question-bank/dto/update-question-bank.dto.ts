import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateQuestionBankDto {
  // Question for the question bank
  @IsNotEmpty()
  @IsString()
  question: string;
}

export class UpdateQuestionBankDto2 {
  @IsNotEmpty()
  @IsInt()
  questionId: number

  // Question for the question bank
  @IsNotEmpty()
  @IsString()
  question: string;
}