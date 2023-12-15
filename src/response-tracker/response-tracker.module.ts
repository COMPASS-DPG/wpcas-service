import { Module } from "@nestjs/common";
import { ResponseTrackerService } from "./response-tracker.service";
import { ResponseTrackerController } from "./response-tracker.controller";
import { PrismaService } from "..//prisma/prisma.service";

@Module({
  controllers: [ResponseTrackerController],
  providers: [ResponseTrackerService, PrismaService],
  exports: [ResponseTrackerService],
})
export class ResponseTrackerModule {}
