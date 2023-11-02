import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../prisma/prisma.service";
import { ResponseTrackerModule } from "./response-tracker.module";
import { CreateResponseTrackerDto } from "./dto";
import { AnswerEnum } from "./enums/response-tracker.enums";
import { ResponseTrackerStatusEnum } from "@prisma/client";

describe("ResponseTrackerController e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ResponseTrackerModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    const configService = app.get<ConfigService>(ConfigService);
    const apiPrefix = configService.get<string>("API_PREFIX") || "api";
    const PORT = configService.get<number>("APP_PORT") || 4010;
    app.setGlobalPrefix(apiPrefix);

    await app.init();
    await app.listen(PORT);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl(`http://localhost:${PORT}/${apiPrefix}`);
  });

  afterAll(async () => {
    await app.close();
  });

  // beforeEach(async () => {
  //   // You may want to reset or seed the database before each test.
  //   // This is not shown in the provided code but is important for reliable testing.
  // });

  describe("Create ResponseTrackerController", () => {
    it("should create a new ResponseTracker", async () => {
      const createResponseTrackerDto: CreateResponseTrackerDto = {
        surveyFormId: 1,
        assessorId: "4d62c39b-8102-4c9c-83a9-90b18b02d405",
        assesseeId: "a7e57477-9e62-4aa1-8ed6-6d58a74a394f",
        responseJson: JSON.parse(
          JSON.stringify([
            {
              questionId: 1,
              answer: `${AnswerEnum.YES}`,
            },
          ])
        ),
        status: ResponseTrackerStatusEnum.COMPLETED,
      };

      await pactum
        .spec()
        .post("/response-tracker")
        .withBody(createResponseTrackerDto)
        .expectStatus(201)
        .expectJsonMatch({
          message: "Successfully created response tracer",
          data: {
            ...createResponseTrackerDto,
            id: 1,
          },
        });
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const invalidCreateResponseTrackerDto = {
        surveyFormId: "invalid",
        assessorId: "invalid",
        assesseeId: "invalid",
        response: "invalid",
      };

      await pactum
        .spec()
        .post("/response-tracker")
        .withBody(invalidCreateResponseTrackerDto)
        .expectStatus(400);
    });
  });

  describe("GetAllResponseTrackersController", () => {
    it("should get all ResponseTrackers", async () => {
      const responseResponseTrackerDto = {
        id: 1,
        surveyFormId: 1,
        assessorId: "4d62c39b-8102-4c9c-83a9-90b18b02d405",
        assesseeId: "a7e57477-9e62-4aa1-8ed6-6d58a74a394f",
        responseJson: JSON.parse(
          JSON.stringify([
            {
              questionId: 1,
              answer: `${AnswerEnum.YES}`,
            },
          ])
        ),
        status: ResponseTrackerStatusEnum.COMPLETED,
      };

      await pactum
        .spec()
        .get("/response-tracker")
        .expectStatus(200)
        .expectJsonMatch({
          message: "Successfully fetched all response tracers",
          data: [responseResponseTrackerDto],
        });
    });
  });

  describe("GetResponseTrackerByIdController", () => {
    it("should get a ResponseTracker by ID", async () => {
      const responseResponseTrackerDto = {
        id: 1,
        surveyFormId: 1,
        assessorId: "4d62c39b-8102-4c9c-83a9-90b18b02d405",
        assesseeId: "a7e57477-9e62-4aa1-8ed6-6d58a74a394f",
        responseJson: JSON.parse(
          JSON.stringify([
            {
              questionId: 1,
              answer: `${AnswerEnum.YES}`,
            },
          ])
        ),
        status: ResponseTrackerStatusEnum.COMPLETED,
      };

      await pactum
        .spec()
        .get("/response-tracker/1")
        .expectStatus(200)
        .expectJsonMatch({
          message: "Successfully fetched response tracer for id #1",
          data: responseResponseTrackerDto,
        });
    });

    it("should return a 404 error if the ResponseTracker does not exist", async () => {
      await pactum.spec().get("/response-tracker/999").expectStatus(404);
    });
  });

  describe("GetResponseTrackersBySurveyFormIdController", () => {
    it("should get ResponseTrackers by surveyFormId", async () => {
      const responseResponseTrackerDto = {
        id: 1,
        surveyFormId: 1,
        assessorId: "4d62c39b-8102-4c9c-83a9-90b18b02d405",
        assesseeId: "a7e57477-9e62-4aa1-8ed6-6d58a74a394f",
        responseJson: JSON.parse(
          JSON.stringify([
            {
              questionId: 1,
              answer: `${AnswerEnum.YES}`,
            },
          ])
        ),
        status: ResponseTrackerStatusEnum.COMPLETED,
      };

      await pactum
        .spec()
        .get("/response-tracker/survey-form/1")
        .expectStatus(200)
        .expectJsonMatch({
          message: "Successfully fetched response tracer for surveyFormId #1",
          data: [responseResponseTrackerDto],
        });
    });
  });

  describe("GetResponseTrackersByAssessorIdController", () => {
    it("should get ResponseTrackers by assessorId", async () => {
      const responseResponseTrackerDto = {
        id: 1,
        surveyFormId: 1,
        assessorId: "4d62c39b-8102-4c9c-83a9-90b18b02d405",
        assesseeId: "a7e57477-9e62-4aa1-8ed6-6d58a74a394f",
        responseJson: JSON.parse(
          JSON.stringify([
            {
              questionId: 1,
              answer: `${AnswerEnum.YES}`,
            },
          ])
        ),
        status: ResponseTrackerStatusEnum.COMPLETED,
      };

      await pactum
        .spec()
        .get("/response-tracker/assessor/4d62c39b-8102-4c9c-83a9-90b18b02d405")
        .expectStatus(200)
        .expectJsonMatch({
          message:
            "Successfully fetched response tracer for assessorId #4d62c39b-8102-4c9c-83a9-90b18b02d405",
          data: [responseResponseTrackerDto],
        });
    });
  });
});
