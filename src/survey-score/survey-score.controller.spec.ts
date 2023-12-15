import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import * as pactum from "pactum";
import { PrismaService } from "../prisma/prisma.service";
import { SurveyScoreModule } from "./survey-score.module";
import {
  CreateSurveyScoreDto,
  GenerateSurveyScoreDto,
  UpdateSurveyScoreDto,
} from "./dto";

describe("SurveyFormController e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SurveyScoreModule],
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

  describe("create()", () => {
    it("should create a new survey score", async () => {
      const createSurveyScoreDto: CreateSurveyScoreDto = {
        competencyId: 1,
        competencyLevelNumber: 10,
        score: 30,
        surveyFormId: 1,
      };

      const response = await pactum
        .spec()
        .post("/survey-score")
        .withBody(createSurveyScoreDto)
        .expectStatus(201);

      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(`Successfully created survey score`);
      expect(surveyScore.data).toHaveProperty("id");
      expect(surveyScore.data.competencyLevelNumber).toEqual(
        createSurveyScoreDto.competencyLevelNumber
      );
      expect(surveyScore.data.surveyFormId).toEqual(
        createSurveyScoreDto.surveyFormId
      );
      expect(surveyScore.data.score).toEqual(createSurveyScoreDto.score);
      expect(surveyScore.data.competencyId).toEqual(
        createSurveyScoreDto.competencyId
      );
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const createSurveyScoreDto = {
        surveyFormId: null,
        userId: "",
        answers: {},
      };

      const response = await pactum
        .spec()
        .post("/survey-score")
        .withBody(createSurveyScoreDto)
        .expectStatus(400);
      const createdSurveyScore = JSON.parse(JSON.stringify(response.body));
      expect(createdSurveyScore.error).toEqual("Bad Request");
    });
  });

  describe("findAll()", () => {
    it("should get all survey scores", async () => {
      const response = await pactum
        .spec()
        .get("/survey-score")
        .expectStatus(200);

      const surveyScores = JSON.parse(JSON.stringify(response.body));      
      expect(surveyScores.message).toEqual(
        "Successfully fetched all survey scores"
      );
      expect(surveyScores.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("findBySurveyFormId()", () => {
    it("should get survey scores by survey form ID", async () => {
      const surveyFormId = 1;

      const response = await pactum
        .spec()
        .get(`/survey-score/survey-form/${surveyFormId}`)
        .withPathParams({
          id: surveyFormId,
        })
        .expectStatus(200);

      const surveyScores = JSON.parse(JSON.stringify(response.body));
      expect(surveyScores.message).toEqual(
        `Successfully fetched survey score with surveyFormId #${surveyFormId}`
      );
      expect(surveyScores.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("findOne()", () => {
    it("should get a survey score by ID", async () => {
      const id = 1;

      const response = await pactum
        .spec()
        .get(`/survey-score/${id}`)
        .withPathParams({
          id,
        })
        .expectStatus(200);

      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully fetched survey score with id #${id}`
      );
      expect(surveyScore.data.id).toEqual(id);
      expect(surveyScore.data.surveyFormId).toBeDefined();
      expect(surveyScore.data.competencyId).toBeDefined();
      expect(surveyScore.data.competencyLevelNumber).toBeDefined();
      expect(surveyScore.data.score).toBeDefined();
    });
  });

  describe("update()", () => {
    it("should update a survey score by ID", async () => {
      const id = 1;
      const updateSurveyScoreDto: UpdateSurveyScoreDto = {
        score: 87,
      };
      const response = await pactum
        .spec()
        .patch(`/survey-score/${id}`)
        .withPathParams({
          id,
        })
        .withBody(updateSurveyScoreDto)
        .expectStatus(200);
      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully updated survey score with id #${id}`
      );
      expect(surveyScore.data.id).toEqual(id);
      expect(surveyScore.data.surveyFormId).toBeDefined();
      expect(surveyScore.data.competencyId).toBeDefined();
      expect(surveyScore.data.competencyLevelNumber).toBeDefined();
      expect(surveyScore.data.score).toBeDefined();
    });
  });

  describe("remove()", () => {
    it("should delete a survey score by ID", async () => {
      const id = 1;
      const response = await pactum
        .spec()
        .delete(`/survey-score/${id}`)
        .withPathParams({
          id,
        })
        .expectStatus(200);
      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully deleted survey score with id #${id}`
      );
      expect(surveyScore.data.id).toEqual(id);
      expect(surveyScore.data.surveyFormId).toBeDefined();
      expect(surveyScore.data.competencyId).toBeDefined();
      expect(surveyScore.data.competencyLevelNumber).toBeDefined();
      expect(surveyScore.data.score).toBeDefined();
    });
  });

  describe("generateSurveyScore()", () => {
    it("should calculate survey score by survey form id", async () => {
      const generateSurveyScoreDto: GenerateSurveyScoreDto = {
        surveyFormId: 1,
      };
      const response = await pactum
        .spec()
        .post("/survey-score/calculate-score")
        .withHeaders({
          "Content-Type": "application/json",
        })
        .withBody(generateSurveyScoreDto)
        .expectStatus(200);
      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully calculated survey score for surveyFormId #${generateSurveyScoreDto.surveyFormId}`
      );
    });
  });

  describe("getLatestSurveyScoreByUserId()", () => {
    it("should get latest survey scores by user id", async () => {
      const userId = "4f67ae5a-c2a2-4652-81cc-4d1471e1a158";
      const response = await pactum
        .spec()
        .get(`/survey-score/latest-survey-score/${userId}`)
        .withPathParams({
          userId,
        })
        .expectStatus(200);
      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully fetched latest survey score for userId #${userId}`
      );
    });
  });

  describe("getAllSurveyScoreByUserId()", () => {
    it("should get all survey scores by user id", async () => {
      const userId = "4f67ae5a-c2a2-4652-81cc-4d1471e1a158";
      const response = await pactum
        .spec()
        .get(`/survey-score/latest-survey-score/${userId}`)
        .withPathParams({
          userId,
        })
        .expectStatus(200);
      const surveyScore = JSON.parse(JSON.stringify(response.body));
      expect(surveyScore.message).toEqual(
        `Successfully fetched latest survey score for userId #${userId}`
      );
    });
  });
});
