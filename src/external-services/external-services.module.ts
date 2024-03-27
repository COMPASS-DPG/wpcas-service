import { Module } from '@nestjs/common';
import { PassbookModule } from './passbook/passbook.module';
import { SunbirdRcModule } from './sunbird-rc/sunbird-rc.module';
import { TarentoModule } from './tarento/tarento.module';

@Module({
  imports: [PassbookModule, SunbirdRcModule, TarentoModule],
  exports: [PassbookModule, SunbirdRcModule, TarentoModule]
})
export class ExternalServicesModule {}
