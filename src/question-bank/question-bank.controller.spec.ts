import * as pactum from "pactum";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { QuestionBankModule } from "./question-bank.module";
import { CreateQuestionBankDto } from "./dto/create-question-bank.dto";
import { UpdateQuestionBankDto } from "./dto/update-question-bank.dto";

describe("QuestionBankController", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [QuestionBankModule],
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

  describe("QuestionBankController createQuestionByCompentencyLevel()", () => {
    it("should return created question by compentency level", async () => {
      const createQuestionDto: CreateQuestionBankDto = {
        competencyId: 1,
        question: "This is test question.",
        competencyLevelNumber: 1,
      };
      const response = await pactum
        .spec()
        .post("/question-bank")
        .withBody(createQuestionDto)
        .expectStatus(201);
      const createdQuestion = JSON.parse(JSON.stringify(response.body));

      expect(createdQuestion.message).toEqual("Question created sucessfully.");
      expect(createdQuestion).not.toBeNull();
      expect(createdQuestion.data.competencyId).toEqual(
        createQuestionDto.competencyId
      );
      expect(createdQuestion.data.question).toEqual(createQuestionDto.question);
      expect(createdQuestion.data.competencyLevelNumber).toEqual(
        createQuestionDto.competencyLevelNumber
      );
    });
  });

  describe("QuestionBankController getAllQuestions()", () => {
    it("should return all questions", async () => {
      const response = await pactum
        .spec()
        .get("/question-bank")
        .expectStatus(200);

      const questions = JSON.parse(JSON.stringify(response.body));
      expect(questions.message).toEqual("Successfully fetched all questions.");
      expect(questions.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("QuestionBankController updateQuestionById()", () => {
    const testData = {
      id: 1,
    };
    it("should update the question by id", async () => {
      const updatedQuestionDto: UpdateQuestionBankDto = {
        question: "Updated Test Question",
      };
      const response = await pactum
        .spec()
        .patch(`/question-bank/update/${testData.id}`)
        .withPathParams({
          id: testData.id,
        })
        .withBody(updatedQuestionDto)
        .expectStatus(200);
      const updatedQuestion = JSON.parse(JSON.stringify(response.body));
      expect(updatedQuestion.message).toEqual(
        `Successfully updated question for id #${testData.id}`
      );
      expect(updatedQuestion.data.question).toEqual(
        updatedQuestionDto.question
      );
      expect(updatedQuestion.data.competencyId).toBeDefined();
      expect(updatedQuestion.data.competencyLevelNumber).toBeDefined();
    });
  });

  describe("QuestionBankController deleteQuestionById()", () => {
    const testData = {
      id: 1,
    };
    it("should delete a question with given id", async () => {
      const response = await pactum
        .spec()
        .delete(`/question-bank/delete/${testData.id}`)
        .withPathParams({
          id: testData.id,
        })
        .expectStatus(200);
      const deletedQuestion = JSON.parse(JSON.stringify(response.body));
      expect(deletedQuestion.message).toEqual(
        `Successfully deleted question for id #${testData.id}`
      );
      expect(deletedQuestion.data.question).toBeDefined();
      expect(deletedQuestion.data.competencyId).toBeDefined();
      expect(deletedQuestion.data.competencyLevelNumber).toBeDefined();
    });
  });

  describe("QuestionBankController getAllQuestionsForUser()", () => {
    const testData = {
      userId: "4d45a9e9-4a4d-4c92-aaea-7b5abbd6ff98",
    };
    it("should get all the mapped question for a user with given userId.", async () => {
      const response = await pactum
        .spec()
        .get(`/question-bank/user/${testData.userId}`)
        .withPathParams({
          userId: testData.userId,
        })
        .expectStatus(200);
      const questionsForUser = JSON.parse(JSON.stringify(response.body));
      expect(questionsForUser.message).toEqual(
        `Successfully get all the question for id #${testData.userId}`
      );
      expect(questionsForUser.data.length).toBeGreaterThanOrEqual(1);
    });
  });
});
