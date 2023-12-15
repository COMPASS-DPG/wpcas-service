import { CompetencyLevels } from "./create-admin-competency.dto";

export class AdminCompetencyResponse {
  id: number;
  competencyId: number;
  name: string;
  description?: string;
  competencyLevels: CompetencyLevels[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class AdminCompetencyResponseDto {
  data?: AdminCompetencyResponse;
  message: string;
  statusCode?: number;
}

export class AdminCompetencyArrayResponseDto {
  data?: AdminCompetencyResponse[];
  message: string;
  statusCode?: number;
}
