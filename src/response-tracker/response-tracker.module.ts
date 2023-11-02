import { Module } from "@nestjs/common";
import { ResponseTrackerService } from "./response-tracker.service";
import { ResponseTrackerController } from "./response-tracker.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ResponseTrackerController],
  providers: [ResponseTrackerService],
  exports: [ResponseTrackerService],
})
export class ResponseTrackerModule {}
