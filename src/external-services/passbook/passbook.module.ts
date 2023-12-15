import { Module } from '@nestjs/common';
import { PassbookService } from './passbook.service';

@Module({
  providers: [PassbookService],
  exports: [PassbookService]
})
export class PassbookModule {}
