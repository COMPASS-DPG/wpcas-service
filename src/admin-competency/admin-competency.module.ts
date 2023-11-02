import { Module } from '@nestjs/common';
import { AdminCompetencyService } from './admin-competency.service';
import { AdminCompetencyController } from './admin-competency.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [AdminCompetencyController],
  providers: [AdminCompetencyService]
})
export class AdminCompetencyModule {}
