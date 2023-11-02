import { Module } from "@nestjs/common";
import { MockDepartmentService } from "./mock-department.service";
import { MockDepartmentController } from "./mock-department.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  controllers: [MockDepartmentController],
  providers: [MockDepartmentService],
})
export class MockDepartmentModule {}
