import { Module } from "@nestjs/common";
import { MockUserService } from "./mock-user.service";
import { MockUserController } from "./mock-user.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [MockUserController],
  providers: [MockUserService],
  exports: [MockUserService],
})
export class MockUserModule {}
