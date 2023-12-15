import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { getPrismaErrorStatusAndMessage } from "../utils/utils";
import { UserMetadataFilterDto } from "./dto";
import {
  ResponseUserMetadataDto,
  UserResponseMessage,
} from "./dto/user-metadata-response.dto";
import { UserMetadataService } from "./user-metadata.service";

@Controller("user-metadata")
@ApiTags("user-metadata")
export class UserMetadataController {
  constructor(private readonly userMetadataService: UserMetadataService) {}
  private readonly logger = new Logger(UserMetadataController.name);

  @Post("sync-user-metadata")
  @ApiOperation({ summary: "Sync userMetadata with user org" })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserResponseMessage })
  async SyncUserDataWithFrac(@Res() res): Promise<UserResponseMessage> {
    try {
      this.logger.log(`Initiated sync of userMetadata with user org`);

      const userMetadata =
        await this.userMetadataService.syncUserDataWithFrac();

      this.logger.log(`Successfully sync userMetadata with user org.`);

      return res.status(HttpStatus.CREATED).json({
        message: "Successfully sync userMetadata with user org.",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to sync userMetadata with user org.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed sync userMetadata with user org.`,
      });
    }
  }

  @Post(":userId")
  @ApiOperation({ summary: "Create or Update User Metadata" })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseUserMetadataDto })
  async createOrUpdateUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Creating or Updating User Metadata`);

      const userMetadata =
        await this.userMetadataService.createOrUpdateUserMetadata(userId);

      this.logger.log(`Successfully created the new survey config.`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata created or updated successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to Create or Update User Metadata.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to Create or Update User Metadata.`,
      });
    }
  }

  @Get(":userId")
  @ApiOperation({ summary: "Fetch User Metadata by userId" })
  @ApiResponse({ status: HttpStatus.FOUND, type: ResponseUserMetadataDto })
  async findUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Fetching User Metadata`);

      const userMetadata = await this.userMetadataService.findUserMetadataById(
        userId
      );

      this.logger.log(`Successfully fetched UserMetadata for id #${userId}.`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata fetched successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch UserMetadata for id #${userId}.`,
        error
      );

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message:
          errorMessage || `Failed to fetch UserMetadata for id #${userId}.`,
      });
    }
  }

  @Get()
  @ApiOperation({
    summary: "Fetch User Metadata accordind to the filter specified.",
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    type: ResponseUserMetadataDto,
    isArray: true,
  })
  async findManyUserMetadata(
    @Res() res,
    @Query() filter: UserMetadataFilterDto
  ): Promise<ResponseUserMetadataDto[]> {
    try {
      this.logger.log(`Fetching UserMetadata(s)`);

      const userMetadata = await this.userMetadataService.findManyUserMetadata(
        filter
      );

      this.logger.log(`Successfully fetched UserMetadata(s).`);

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata(s) fetched successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to fetch UserMetadata(s).`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to fetch UserMetadata(s).`,
      });
    }
  }

  @Delete(":userId")
  @ApiOperation({ summary: "Delete User Metadata." })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseUserMetadataDto })
  async deleteUserMetadata(
    @Res() res,
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<ResponseUserMetadataDto> {
    try {
      this.logger.log(`Deleting UserMetadata.`);

      const userMetadata = await this.userMetadataService.deleteUserMetadata(
        userId
      );

      this.logger.log(
        `Successfully deleted UserMetadata with userId ${userId}.`
      );

      return res.status(HttpStatus.OK).json({
        message: "UserMetadata deleted successfully",
        data: userMetadata,
      });
    } catch (error) {
      this.logger.error(`Failed to delete UserMetadata.`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to delete UserMetadata.`,
      });
    }
  }
}
