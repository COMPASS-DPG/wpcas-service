import { Module } from '@nestjs/common';
import { MockDesignationService } from './mock-designation.service';
import { MockDesignationController } from './mock-designation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports : [PrismaModule],
  providers: [MockDesignationService],
  controllers: [MockDesignationController]
})
export class MockDesignationModule {}
