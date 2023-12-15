import * as pactum from "pactum";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { SurveyConfigModule } from "./survey-config.module";
import { ConfigService } from "@nestjs/config";
import { CreateSurveyConfigDto } from "./dto/create-survey-config.dto";

describe("SurveyConfig e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SurveyConfigModule],
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

  describe("SurveyConfigController createSurveyConfig()", () => {
    it("should create a new survey config", async () => {
      const createSurveyConfigDto : CreateSurveyConfigDto = {
        startTime: new Date("2023-10-31"),
        endTime: new Date("2024-01-31"),
        departmentId: 1,
        onboardingTime: 30,
        onboardingTimeUnit: "DAY",
      };

      const response = await pactum
        .spec()
        .post("/survey-config")
        .withBody(createSurveyConfigDto)
        .expectStatus(201);

      const createdSurveyConfig = JSON.parse(JSON.stringify(response.body));
      expect(createdSurveyConfig.message).toEqual(
        `Survey config created successfully`
      );
      expect(createdSurveyConfig.data).toHaveProperty("id")
      expect(createdSurveyConfig.data.departmentId).toEqual(
        createSurveyConfigDto.departmentId
      );
      expect(createdSurveyConfig.data.startTime).toBeDefined()
      expect(createdSurveyConfig.data.endTime).toBeDefined()
      expect(createdSurveyConfig.data.onboardingTime).toEqual(createSurveyConfigDto.onboardingTime);
      expect(createdSurveyConfig.data.onboardingTimeUnit).toEqual(createSurveyConfigDto.onboardingTimeUnit);
    });
  });

  describe("SurveyConfigController getAllSurveyConfig()", () => {
    it("should get all survey configs", async () => {
      const response = await pactum
        .spec()
        .get("/survey-config")
        .expectStatus(200);

      const surveyConfigs = JSON.parse(JSON.stringify(response.body));
      expect(surveyConfigs.message).toEqual(
        "Successfully fetched all survey config."
      );
      expect(surveyConfigs.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("SurveyConfigController updateSurveyConfigById()", () => {
    it("should update an existing survey config", async () => {
      const testData = {
        id: 1,
      };
      const updateSurveyConfigDto = {
        onboardingTime: 2,
        onboardingTimeUnit: "MONTH",
      };

      const response = await pactum
        .spec()
        .patch(`/survey-config/update/${testData.id}`)
        .withPathParams({
          id: testData.id,
        })
        .withBody(updateSurveyConfigDto)
        .expectStatus(200);

      const updatedSurveyConfig = JSON.parse(JSON.stringify(response.body));

      expect(updatedSurveyConfig.message).toEqual(
        `Successfully updated survey config for id #${testData.id}`
      );
      expect(updatedSurveyConfig.data.id).toEqual(testData.id);
      expect(updatedSurveyConfig.data.departmentId).toBeDefined();
      expect(updatedSurveyConfig.data.onboardingTime).toEqual(
        updateSurveyConfigDto.onboardingTime
      );
      expect(updatedSurveyConfig.data.onboardingTimeUnit).toEqual(
        updateSurveyConfigDto.onboardingTimeUnit
      );
      expect(updatedSurveyConfig.data.startTime).toBeDefined();
      expect(updatedSurveyConfig.data.endTime).toBeDefined();
    });
  });

  describe("SurveyConfigController deleteSurveyConfigById()", () => {
    it("should delete an existing survey config", async () => {
      const testData = {
        id: 1,
      };
      const response = await pactum
        .spec()
        .delete(`/survey-config/delete/${testData.id}`)
        .withPathParams({
          id: testData.id,
        })
        .expectStatus(200);

      const deletedSurveyConfig = JSON.parse(JSON.stringify(response.body));
      expect(deletedSurveyConfig.message).toEqual(
        `Successfully deleted survey config for id #${testData.id}`
      );
      expect(deletedSurveyConfig.data.id).toEqual(testData.id);
      expect(deletedSurveyConfig.data.departmentId).toBeDefined();
      expect(deletedSurveyConfig.data.onboardingTime).toBeDefined();
      expect(deletedSurveyConfig.data.onboardingTimeUnit).toBeDefined();
      expect(deletedSurveyConfig.data.startTime).toBeDefined();
      expect(deletedSurveyConfig.data.endTime).toBeDefined();
    });
  });
});
