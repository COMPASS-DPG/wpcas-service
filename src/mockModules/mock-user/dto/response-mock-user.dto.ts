export class ResponseMockUserDto {
  readonly id: number;
  readonly email: string;
  readonly role: string;
  readonly userName: string;
  readonly password: string;
  readonly profilePicture?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly levelId: number;
  readonly teamId: number;
}
