import { Module } from "@nestjs/common";
import { TarentoService } from "./tarento.service";

@Module({
    providers: [TarentoService],
    exports: [TarentoService]
})
export class TarentoModule {}