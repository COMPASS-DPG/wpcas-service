import { ResponseTrackerStatusEnum } from "@prisma/client";

export interface IResponseTracker {
    id: number;
    status: ResponseTrackerStatusEnum;
    Assessor: {
        userId: string;
        userName: string;
    };
}

