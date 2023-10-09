import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { MockUserModule } from "./mockModules/mock-user/mock-user.module";
import { MockLevelModule } from "./mockModules/mock-level/mock-level.module";
import { MockTeamModule } from "./mockModules/mock-team/mock-team.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MockUserModule,
    MockLevelModule,
    MockTeamModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
