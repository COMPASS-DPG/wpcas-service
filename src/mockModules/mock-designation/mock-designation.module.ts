import { Module } from '@nestjs/common';
import { MockDesignationService } from './mock-designation.service';
import { MockDesignationController } from './mock-designation.controller';

@Module({
  providers: [MockDesignationService],
  controllers: [MockDesignationController]
})
export class MockDesignationModule {}
