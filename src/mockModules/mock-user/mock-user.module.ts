import { Module } from "@nestjs/common";
import { MockUserService } from "./mock-user.service";
import { MockUserController } from "./mock-user.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports : [PrismaModule],
  controllers: [MockUserController],
  providers: [MockUserService],
  exports: [MockUserService],
})
export class MockUserModule {}
