import { Module } from '@nestjs/common';
import { SurveyParameterService } from './survey-parameter.service';
import { SurveyParameterController } from './survey-parameter.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [SurveyParameterController],
  providers: [SurveyParameterService, PrismaService],
  exports : [SurveyParameterService]
})
export class SurveyParameterModule {}
