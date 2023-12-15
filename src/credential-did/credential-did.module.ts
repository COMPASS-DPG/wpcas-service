import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CredentialDIDService } from "./credential-did.service";
import { CredentialDIDController } from "./credential-did.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { SunbirdRcService } from "src/external-services/sunbird-rc/sunbird-rc.service";

@Module({
  imports: [PrismaModule],
  controllers: [CredentialDIDController],
  providers: [CredentialDIDService, SunbirdRcService],
  exports: [CredentialDIDService],
})
export class CredentialDIDModule {}
