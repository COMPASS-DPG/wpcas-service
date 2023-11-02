import { Module } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { QuestionBankController } from './question-bank.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MockUserService } from 'src/mockModules/mock-user/mock-user.service';
import { MockDesignationService } from 'src/mockModules/mock-designation/mock-designation.service';
import { MockRoleService } from 'src/mockModules/mock-role/mock-role.service';
import { MockCompetencyService } from 'src/mockModules/mock-competency/mock-competency.service';
import { MockCompetencyLevelService } from 'src/mockModules/mock-competency-level/mock-competency-level.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  // Import the PrismaModule to make Prisma service available within this module
  imports: [PrismaModule],

  // Declare the QuestionBankController as a controller for this module
  controllers: [QuestionBankController],

  // Declare the QuestionBankService and PrismaService as providers for this module
  providers: [
    QuestionBankService,
    MockCompetencyService,
    MockCompetencyLevelService,
    PrismaService,
    MockUserService,
    MockDesignationService,
    MockRoleService,
    FileUploadService
  ],

  // Export the QuestionBankService to make it available for other modules that import this module
  exports: [QuestionBankService],
})
export class QuestionBankModule {}
