import { Module, forwardRef } from "@nestjs/common";
import { MockUserService } from "src/mockModules/mock-user/mock-user.service";
import { SurveyConfigModule } from "../survey-config/survey-config.module";
import { UserMetadataController } from "./user-metadata.controller";
import { UserMetadataService } from "./user-metadata.service";
import { PrismaService } from "../prisma/prisma.service";
import { SurveyModule } from "../survey/survey.module";
import { SurveyFormService } from "../survey-form/survey-form.service";
import { TarentoService } from "src/external-services/tarento/tarento.service";

@Module({
  imports: [
    forwardRef(() => SurveyConfigModule),
    forwardRef(() => SurveyModule),
  ],
  controllers: [UserMetadataController],
  providers: [UserMetadataService, PrismaService, MockUserService, SurveyFormService, TarentoService],
  exports: [UserMetadataService],
})
export class UserMetadataModule {}
