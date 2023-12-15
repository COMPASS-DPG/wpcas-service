import { ResponseCompetencyDto } from "src/mockModules/mock-competency/dto";

export class ResponseMockRoleDto {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly competencies?: ResponseCompetencyDto[];
}

export class ResponseAddCompetencyToRoleDto {
  readonly role: ResponseMockRoleDto
  readonly competency: ResponseCompetencyDto
}