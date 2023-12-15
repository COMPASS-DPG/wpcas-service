import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef
} from "@nestjs/common";
import { SunbirdRcService } from "src/external-services/sunbird-rc/sunbird-rc.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUpdateDIDDto } from "./dto";

@Injectable()
export class CredentialDIDService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(()=>SunbirdRcService))
    private sunbirdRc: SunbirdRcService
  ) {}

  async createOrUpdateDIDs(createOrUpdateDID: CreateUpdateDIDDto) {
    try {
      await this.sunbirdRc.resolveDid(createOrUpdateDID.authorDid);
      await this.sunbirdRc.fetchCredSchemaByIdAndVersion(createOrUpdateDID.schemaDid, createOrUpdateDID.schemaVersion);
      const did = await this.prisma.credentialDid.findFirst();

      if (!did) {
        return await this.prisma.credentialDid.create({
          data: createOrUpdateDID,
        });
      } else {
        return await this.prisma.credentialDid.update({
          where: { id: did.id },
          data: createOrUpdateDID,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findDIDs() {
    const did = await this.prisma.credentialDid.findFirst();
    if (!did) {
      throw new ForbiddenException(
        `Please configure the schema and author DIDs (used to issue credentials).`
      );
    }
    return did;
  }
}
