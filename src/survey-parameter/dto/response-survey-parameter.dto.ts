import { TimeUnitsEnum } from "@prisma/client";

export class ResponseSurveyParameterdto {
  readonly id: number;
  readonly onboardingTime: number;
  readonly onboardingTimeUnit: TimeUnitsEnum;
  readonly surveyCycle: number;
}
