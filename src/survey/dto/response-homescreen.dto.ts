import { SurveyDataResponse } from "../../response-tracker/dto";
import { ResponseUserMetadataDto } from "../../user-metadata/dto/user-metadata-response.dto";

export class HomeScreenResponse{
    readonly users: ResponseUserMetadataDto[];
    readonly surveyData: SurveyDataResponse;
}

export class HomeScreenAPIResponse {
    readonly data: HomeScreenResponse;
    readonly message: string;
}