import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateSurveyConfigDto {
  // maximum number of question for the survey config
  @IsNotEmpty()
  @IsInt()
  maxQuestions: number;

  // start time for the survey config
  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  // end time for the survey config
  @IsNotEmpty()
  @IsDate()
  endTime: Date;
}

// SurveyConfigFilterDto is used for filtering and paginating survey config.
export class SurveyConfigFilterDto {
  // Optional maxQuestions filter validate that its a number
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  maxQuestions?: number;

  //Optional startTime filter validate that its valid date-time value
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  startTime?: Date;

  //Optional endTime filter validate that its valid date-time value.
  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  endTime?: Date;

  // Optional limit for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  limit?: number = 10;

  // Optional offset for pagination, validate that it's an integer.
  @IsOptional()
  @IsInt()
  offset?: number = 0;
}
