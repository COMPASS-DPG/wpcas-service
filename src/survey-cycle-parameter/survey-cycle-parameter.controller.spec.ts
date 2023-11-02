import * as pactum from "pactum";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { SurveyConfigModule } from "../survey-config/survey-config.module";
import { CreateSurveyCycleParameterDto } from "./dto/create-survey-cycle-parameter.dto";
import { ResponseSurveyCycleParameterDto } from "./dto/response-survey-cycle-parameter.dto";
import { UpdateSurveyCycleParameterDto } from "./dto/update-survey-cycle-parameter.dto";

describe("SurveyCycleParameterController e2e", () => {
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
    app.close();
  });
  describe("SurveyCycleParameterController createSurveyParameter()", () => {
    it("should return created survey cycle parameter with id and name", async function () {
      const createSurveyCycleParameterDto: CreateSurveyCycleParameterDto = {
        startTime: new Date("2023-10-31"),
        endTime: new Date("2024-01-31"),
        surveyConfigId: 1,
        isActive: true,
      };

      const response = await pactum
        .spec()
        .post("/survey-cycle-parameter")
        .withBody(createSurveyCycleParameterDto)
        .expectStatus(201);

      const createdSurveyCycleParameter = JSON.parse(response);
      expect(createdSurveyCycleParameter).toHaveProperty("id");
      expect(createdSurveyCycleParameter.startTime).toEqual(
        createSurveyCycleParameterDto.startTime
      );
      expect(createdSurveyCycleParameter.endTime).toEqual(
        createSurveyCycleParameterDto.endTime
      );
      expect(createdSurveyCycleParameter.isActive).toBeTruthy();
      expect(createdSurveyCycleParameter.surveyConfigId).toEqual(
        createSurveyCycleParameterDto.surveyConfigId
      );
      expect(createdSurveyCycleParameter?.createdAt).toBeDefined();
      expect(createdSurveyCycleParameter?.updatedAt).toBeDefined();
    });
  });

  describe("SurveyCycleParameterController getAllSurveyParameter()", () => {
    it("should get all survey cycle parameter", async () => {
      const response = await pactum
        .spec()
        .get("/survey-cycle-parameters")
        .expectStatus(200);

      const getAllSurveyCycleParameter = JSON.parse(response);
      expect(Array.isArray(getAllSurveyCycleParameter)).toBeTruthy();
    });
  });

  describe("SurveyCycleParameterController updateSurveyParameterById()", () => {
    it("should update survey cycle parameter by id", async () => {
      const testData = {
        id: 1,
      };
      const updateSurveyCycleParameterDto: UpdateSurveyCycleParameterDto = {
        startTime: new Date("2023-10-31"),
        endTime: new Date("2024-01-31"),
        isActive: false,
      };
      const response = await pactum
        .spec()
        .patch(`/survey-cycle-parameter/${testData.id}`)
        .withPathParams({
          id: testData.id,
        })
        .withBody(updateSurveyCycleParameterDto)
        .expectStatus(200);
      const updatedSurveyCycleParameter = JSON.parse(response);
      expect(updatedSurveyCycleParameter).toHaveProperty("id");
      expect(updatedSurveyCycleParameter.startTime).toEqual(
        updateSurveyCycleParameterDto.startTime
      );
      expect(updatedSurveyCycleParameter.endTime).toEqual(
        updateSurveyCycleParameterDto.endTime
      );
      expect(updatedSurveyCycleParameter.isActive).toEqual(false);
      expect(updatedSurveyCycleParameter?.createdAt).toBeDefined();
      expect(updatedSurveyCycleParameter?.updatedAt).toBeDefined();
    });
  });
});
