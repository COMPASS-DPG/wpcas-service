import { Module } from "@nestjs/common";
import { PassbookModule } from "./passbook/passbook.module";
import { SunbirdRcModule } from "./sunbird-rc/sunbird-rc.module";
import { TarentoModule } from "./tarento/tarento.module";
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    PassbookModule,
    SunbirdRcModule,
    TarentoModule,
    RouterModule.register([
      { path: "ext-service/", module: TarentoModule },
    ]),
  ],
  exports: [PassbookModule, SunbirdRcModule, TarentoModule],
})
export class ExternalServicesModule {}
