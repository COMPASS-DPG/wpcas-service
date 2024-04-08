import { Module } from "@nestjs/common";
import { TarentoService } from "./tarento.service";
import { PrismaService } from "src/prisma/prisma.service";
import { TarentoController } from "./tarento.controller";

@Module({
    controllers:[TarentoController],
    providers: [TarentoService, PrismaService],
    exports: [TarentoService]
})
export class TarentoModule {}