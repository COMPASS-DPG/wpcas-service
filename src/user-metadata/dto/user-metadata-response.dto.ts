import { ResponseSurveyFormDto } from "src/survey-form/dto";

export class ResponseUserMetadataDto {
  readonly userId: string;
  readonly designation?: string | null;
  readonly isAdmin: boolean;
  readonly isNewEmployee: boolean;
  readonly dateOfJoining: Date;
  readonly SurveyForms?: ResponseSurveyFormDto[];
}

export class UserResponseMessage {
  message: string;
}
