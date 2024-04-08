import { Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TarentoService } from "./tarento.service";
import { getPrismaErrorStatusAndMessage } from "src/utils/utils";

@Controller("tarento")
@ApiTags("ext-service/tarento")
export class TarentoController {
  constructor(private readonly tarentoService: TarentoService) {}

  @Post("syncFracData")
  @ApiOperation({ summary: "Sync FRAC data." })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
  })
  async findAll(@Res() res) {
    try {
      const response = await this.tarentoService.formatAndSyncFracData();
      console.log(response);
      return res.status(HttpStatus.OK).json({
        message: response,
      });
    } catch (error) {
      console.error(`Failed to create new survey score`, error);

      const { errorMessage, statusCode } =
        getPrismaErrorStatusAndMessage(error);

      return res.status(statusCode).json({
        statusCode,
        message: errorMessage || `Failed to create survey score`,
      });
    }
  }
}
