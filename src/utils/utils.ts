import { HttpStatus } from "@nestjs/common";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import _ from "lodash";

export const validationOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export function getPrismaErrorStatusAndMessage(error: any): {
  errorMessage: string | undefined;
  statusCode: number;
} {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientValidationError
  ) {
    const errorCode = _.get(error, "code", "DEFAULT_ERROR_CODE");

    const errorCodeMap: Record<string, number> = {
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2003: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
      DEFAULT_ERROR_CODE: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    const statusCode = errorCodeMap[errorCode];
    const errorMessage = error.message.split("\n").pop();

    return { statusCode, errorMessage };
  }

  const statusCode =
    error?.status ||
    error?.response?.status ||
    HttpStatus.INTERNAL_SERVER_ERROR;
  return {
    statusCode,
    errorMessage: error.message,
  };
}

export function isTomorrow(inputDate: Date): boolean {
  const currentDate = new Date();

  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);

  tomorrow.setHours(0, 0, 0, 0);

  inputDate.setHours(0, 0, 0, 0);

  // Compare the input date with tomorrow
  return inputDate.getTime() === tomorrow.getTime();
}

export function isDayBeforeToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.getTime() === today.getTime();
}

export function isToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const givenDate = new Date(date);
  givenDate.setHours(0, 0, 0, 0);

  return givenDate.getTime() === today.getTime();
}

export function isDateInPast(compareDate: Date, referenceDate: Date): boolean {
  // Convert both dates to UTC to ensure accurate comparison
  const compareDateUTC = new Date(compareDate.toUTCString());
  compareDateUTC.setHours(0, 0, 0, 0);
  const referenceDateUTC = new Date(referenceDate.toUTCString());
  referenceDateUTC.setHours(0, 0, 0, 0);

  // Compare the dates
  return compareDateUTC < referenceDateUTC;
}
