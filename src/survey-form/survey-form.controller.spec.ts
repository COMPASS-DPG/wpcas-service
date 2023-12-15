import * as pactum from "pactum";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { SurveyFormModule } from "./survey-form.module";
import { CreateSurveyFormDto } from "./dto";
import { SurveyStatusEnum } from "@prisma/client";

describe("SurveyFormController e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SurveyFormModule],
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

  const testData = {
    userId: "4f67ae5a-c2a2-4652-81cc-4d1471e1a158",
    surveyFormId: 1,
    surveyCycleParameterId: 1,
  };

  describe("createSurveyForm", () => {
    it("should create a new survey form", async () => {
      const createSurveyFormDto: CreateSurveyFormDto = {
        userId: testData.userId,
        surveyCycleParameterId: testData.surveyCycleParameterId,
        status: SurveyStatusEnum.CREATED,
        questionsJson: [
          { questionId: 1, question: "Is this a dummy question?" },
        ],
      };

      const response = await pactum
        .spec()
        .post("/survey-form")
        .withHeaders("Content-Type", "application/json")
        .withBody(createSurveyFormDto)
        .expectStatus(201);

      const createdSurveyForm = JSON.parse(JSON.stringify(response.body));
      expect(createdSurveyForm).not.toBeNull();
      expect(createdSurveyForm.message).toEqual(
        "SurveyForm created successfully"
      );
      expect(createdSurveyForm.data).toHaveProperty("id")
      expect(createdSurveyForm.data.userId).toEqual(createSurveyFormDto.userId);
      expect(createdSurveyForm.data.surveyCycleParameterId).toEqual(
        createSurveyFormDto.surveyCycleParameterId
      );
      expect(createdSurveyForm.data.status).toEqual(createSurveyFormDto.status);
      expect(createdSurveyForm.data.questionsJson[0].questionId).toEqual(
        createSurveyFormDto.questionsJson[0].questionId
      );
      expect(createdSurveyForm.data.questionsJson[0].question).toEqual(
        createSurveyFormDto.questionsJson[0].question
      );
    });
  });

  describe("getSurveyFormById", () => {
    it("should get a survey form by ID", async () => {
      const response = await pactum
        .spec()
        .get(`/survey-form/${testData.surveyFormId}`)
        .withPathParams({
          id: testData.surveyFormId,
        })
        .expectStatus(200);

      const surveyForm = JSON.parse(JSON.stringify(response.body));
      expect(surveyForm.message).toBe("SurveyForm fetched successfully");
      expect(surveyForm.data.id).toEqual(testData.surveyFormId);
    });
  });

  describe("updateSurveyFormStatus", () => {
    it("should update the status of a survey form", async () => {
      const updateData = { status: SurveyStatusEnum.CLOSED };
      const response = await pactum
        .spec()
        .patch(`/survey-form/status/${testData.surveyFormId}`)
        .withPathParams({
          id: testData.surveyFormId,
        })
        .withJson(updateData)
        .expectStatus(200);

      const updatedSurveyForm = JSON.parse(JSON.stringify(response.body));
      expect(updatedSurveyForm.message).toBe("SurveyForm updated successfully");
      expect(updatedSurveyForm.data.id).toEqual(testData.surveyFormId);
      expect(updatedSurveyForm.data.status).toBe(updateData.status);
      expect(updatedSurveyForm.data.userId).toBeDefined();
    });
  });

  describe("deleteSurveyForm", () => {
    it("should delete a survey form by ID", async () => {
      const response = await pactum
        .spec()
        .delete(`/survey-form/${testData.surveyFormId}`)
        .withPathParams({
          id : testData.surveyFormId
        })
        .expectStatus(200);

      const deletedSurveyForm = JSON.parse(JSON.stringify(response.body));

      expect(deletedSurveyForm.message).toBe("SurveyForm deleted successfully");
      expect(deletedSurveyForm.data.id).toBe(testData.surveyFormId);
      expect(deletedSurveyForm.data.status).toBeDefined();
      expect(deletedSurveyForm.data.userId).toBeDefined();
    });
  });
});
