import { Module } from "@nestjs/common";
import { MockLevelService } from "./mock-level.service";
import { MockLevelController } from "./mock-level.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [MockLevelController],
  providers: [MockLevelService, PrismaService],
})
export class MockLevelModule {}
