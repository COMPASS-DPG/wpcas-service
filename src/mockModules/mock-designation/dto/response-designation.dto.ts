import { ResponseMockRoleDto } from "src/mockModules/mock-role/dto";

export class ResponseDesignationDto {
  readonly id: number;
  readonly name: string;
  readonly description?: string | null;
  readonly Role: ResponseMockRoleDto[]
}
