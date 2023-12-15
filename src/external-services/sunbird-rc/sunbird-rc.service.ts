import { Inject, Injectable, NotAcceptableException, forwardRef } from "@nestjs/common";
import axios from "axios";
import { SurveyScoreCredentailDto } from "./dto";
import { CredentialDIDService } from "src/credential-did/credential-did.service";

@Injectable()
export class SunbirdRcService {
  constructor(
    @Inject(forwardRef(()=>CredentialDIDService))
    private credentialDID: CredentialDIDService
  ){}
  // private credentialUrl = "http://localhost:3000";
  // private credSchemaUrl = "http://localhost:3333";
  // private identityUrl = "http://localhost:3332";
  private sunbirdRcUrl = "http://compass.samagra.io";

  // async addNewCredSchema(schema: any): Promise<any> {
  //   try {
  //     const response = await axios.post(
  //       `${this.sunbirdRcUrl}/credential-schema`,
  //       {
  //         data: {
  //           ...schema
  //         },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     // Handle errors
  //     throw new Error("Failed to fetch data from the external API");
  //   }
  // }

  async fetchCredSchemaByIdAndVersion(schemaDid: string, version: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.sunbirdRcUrl}/credential-schema/${schemaDid}/${version}`
      );
      if(response.status != 200){
        throw new NotAcceptableException(`Authentication failed for the Schema with did #${schemaDid} and version #${version}`);
      }
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch data from the external API(fetchCredSchemaByIdAndVersion)");
    }
  }

  async issueCredential(credentialData: SurveyScoreCredentailDto): Promise<any> {
    try {

      const dids = await this.credentialDID.findDIDs();
      const creationDate = new Date();
      const expirationDate = new Date(creationDate).setFullYear(creationDate.getFullYear() + 1);
      const response = await axios.post(
        `${this.sunbirdRcUrl}/credentials/issue`,
        {
          data: {
            credential: {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1",
              ],
              type: ["VerifiableCredential", "WPCASSurveyScoreCredential"],
              issuer: dids.authorDid,
              expirationDate: expirationDate,
              credentialSubject: {
                ...credentialData
              },
              options: {
                created: creationDate.toISOString(),
                credentialStatus: {
                  type: "RevocationList2020Status",
                },
              },
            },
            credentialSchemaId: dids.schemaDid,
            credentialSchemaVersion: dids.schemaVersion,
            tags: ["tag1", "tag2", "tag3"],
          },
        }
      );
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error(`Failed to issue credentials for user with id #${credentialData.userId}`);
    }
  }

  // async verifyCredentail(did: string): Promise<any> {
  //   try {
  //     const response = await axios.post(
  //       `${this.sunbirdRcUrl}/credentials/${did}/verify`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     // Handle errors
  //     throw new Error("Failed to fetch data from the external API(verifyCredentail)");
  //   }
  // }

  async resolveDid(did: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.sunbirdRcUrl}/did/resolve/${did}`
      );
      if(response.status != 200){
        throw new NotAcceptableException(`Authentication failed for the did #${did}`);
      }
      return response.data;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch data from the external API(resolveDid)");
    }
  }

  // async getCredentailById(credentialDID: string): Promise<any> {
  //   try {
  //     const response = await axios.get(`${this.sunbirdRcUrl}/credentials/${credentialDID}`);
  //     return response.data;
  //   } catch (error) {
  //     // Handle errors
  //     throw new Error("Failed to fetch data from the external API(getCredentailById)");
  //   }
  // }
}
