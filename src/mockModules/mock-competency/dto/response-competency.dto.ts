import { ResponseCompetencyLevelDto } from "src/mockModules/mock-competency-level/dto";
import { ResponseMockRoleDto } from "src/mockModules/mock-role/dto";

export class ResponseCompetencyDto {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly roles?: ResponseMockRoleDto[];
  readonly competencies?: ResponseCompetencyDto[];
}

export class ResponseAddCompetencyLevelToCompetency {
  readonly competency: ResponseCompetencyDto;
  readonly competencyLevel?: ResponseCompetencyLevelDto;
}
