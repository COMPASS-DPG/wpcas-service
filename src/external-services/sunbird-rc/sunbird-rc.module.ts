import { Module, forwardRef } from '@nestjs/common';
import { SunbirdRcService } from './sunbird-rc.service';
import { CredentialDIDModule } from 'src/credential-did/credential-did.module';
import { CredentialDIDService } from 'src/credential-did/credential-did.service';

@Module({
  providers: [CredentialDIDService, SunbirdRcService],
  exports: [SunbirdRcService] 
})
export class SunbirdRcModule {}
