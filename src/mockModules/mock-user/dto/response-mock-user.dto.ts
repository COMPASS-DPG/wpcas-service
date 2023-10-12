import { ResponseCompetencyLevelDto } from "src/mockModules/mock-competency-level/dto";
import { ResponseMockRoleDto } from "src/mockModules/mock-role/dto";
import { ResponseMockTeamDto } from "src/mockModules/mock-team/dto/response-mock-team.dto";

export class ResponseMockUserDto {
  readonly id: number;
  readonly email: string;
  readonly role: string;
  readonly userName: string;
  readonly profilePicture?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly levelId?: number;
  readonly teamId?: number;
  readonly Level?: ResponseCompetencyLevelDto;
  readonly Team?: ResponseMockTeamDto;
  readonly Roles?: ResponseMockRoleDto[];
}
