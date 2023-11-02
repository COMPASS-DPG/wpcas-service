import { Module } from "@nestjs/common";
import { MockLevelService } from "./mock-level.service";
import { MockLevelController } from "./mock-level.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MockLevelController],
  providers: [MockLevelService],
})
export class MockLevelModule {}
