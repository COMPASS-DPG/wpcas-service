import { ResponseTrackerStatusEnum } from "@prisma/client";
import { responseObject } from "./create-response-tracker.dto";

export class ResponseTracker {
  readonly id: number;
  readonly assesseeId: string;
  readonly surveyFormId: number;
  readonly assessorId: string;
  readonly responseJson?: responseObject[];
  readonly status: ResponseTrackerStatusEnum;
}

export class ResponseTrackerDtoResponse {
  data?: ResponseTracker;
  message: string;
  statusCode?: number;
}

export class ResponseTrackerDtoMultipleResponse {
  data?: ResponseTracker[];
  message: string;
  statusCode?: number;
}

export class SurveyDataResponse{
  totalSurveys: number;
  totalSurveysFilled: number;
  totalSurveysToBeFilled: number;
}