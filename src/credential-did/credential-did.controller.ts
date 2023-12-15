import { Body, Controller, HttpStatus, Logger, Post, Res, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CredentialDIDService } from "./credential-did.service";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";
import { CreateUpdateDIDDto } from "./dto";

@Controller("credentialDID")
@ApiTags("credentialDID")
export class CredentialDIDController {
  private readonly logger = new Logger(CredentialDIDController.name);
  constructor(private readonly credentialDIDService: CredentialDIDService) {}

  @Post()
  async createOrUpdateDIDs(@Res() res, @Body() createUpdateDID: CreateUpdateDIDDto) {
    // Log the initiaton for csv file upload
    this.logger.log(`Creating or updating DIDs`);
    try {
      const result = await this.credentialDIDService.createOrUpdateDIDs(createUpdateDID)
      this.logger.log(`Created or updated DIDs successfully.`);
      return res.status(HttpStatus.OK).json({
        message: "Created or updated DIDs successfully.",
      });
    } catch (error) {
      this.logger.error(`Failed to create or update DIDs..`, error);
      // get error message and status code
      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);
      // Return an error response
      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create or update DIDs.`,
      });
    }
  }
}
