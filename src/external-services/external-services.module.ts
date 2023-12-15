import { Module } from '@nestjs/common';
import { PassbookModule } from './passbook/passbook.module';
import { SunbirdRcModule } from './sunbird-rc/sunbird-rc.module';

@Module({
  imports: [PassbookModule, SunbirdRcModule],
  exports: [PassbookModule, SunbirdRcModule]
})
export class ExternalServicesModule {}
