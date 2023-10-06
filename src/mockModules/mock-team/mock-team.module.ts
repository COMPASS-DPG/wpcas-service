import { Module } from "@nestjs/common";
import { MockTeamService } from "./mock-team.service";
import { MockTeamController } from "./mock-team.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [MockTeamController],
  providers: [MockTeamService, PrismaService],
})
export class MockTeamModule {}
