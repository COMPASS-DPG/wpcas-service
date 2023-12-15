import * as pactum from "pactum";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateAdminCompetencyDto } from "./dto/create-admin-competency.dto";
import { UpdateAdminCompetencyDto } from "./dto";
import { AdminCompetencyModule } from "./admin-competency.module";

describe("AdminCompetencyController e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AdminCompetencyModule],
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

  describe("AdminCompetencyController, findAll()", () => {
    it("should get all admin competency", async () => {
      const response = await pactum
        .spec()
        .get("/admin-competency")
        .expectStatus(200);

      const adminCompetencies = JSON.parse(JSON.stringify(response.body));
      expect(adminCompetencies.message).toEqual(
        "Successfully fetched all admin-competency"
      );
      expect(adminCompetencies.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("AdminCompetencyController, findAllCompetencyNames()", () => {
    it("should get admin competency by names", async () => {
      const response = await pactum
        .spec()
        .get("/admin-competency/names")
        .expectStatus(200);

      const adminCompetencies = JSON.parse(JSON.stringify(response.body));
      expect(adminCompetencies.message).toEqual(
        `Successfully fetched all admin-competency`
      );
      expect(adminCompetencies.data.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("AdminCompetencyController findOne()", () => {
    const testData = {
      competencyId: 1,
    };
    it("should findOne admin competency by competencyId", async () => {
      const response = await pactum
        .spec()
        .get(`/admin-competency/${testData.competencyId}`)
        .withPathParams({
          competencyId: testData.competencyId,
        })
        .expectStatus(200);

      const adminCompetncy = JSON.parse(JSON.stringify(response.body));
      expect(adminCompetncy).not.toBeNull();
      expect(adminCompetncy.message).toEqual(
        `Successfully fetched admin-competency with competency id #${testData.competencyId}`
      );
      expect(adminCompetncy.data.competencyId).toEqual(testData.competencyId);
      expect(adminCompetncy.data.name).toBeDefined();
      expect(adminCompetncy.data.description).toBeDefined();
    });
  });

  describe("AdminCompetencyController update()", () => {
    it("should updated admin competency by competencyId", async () => {
      const updatedAdminCompetencyDto: UpdateAdminCompetencyDto = {
        name: "Updated Test Competency Name",
        description: "Updated Test Description",
      };
      const testData = {
        competencyId: 1,
      };
      const response = await pactum
        .spec()
        .patch(`/admin-competency/${testData.competencyId}`)
        .withPathParams({
          competencyId: testData.competencyId,
        })
        .withBody(updatedAdminCompetencyDto)
        .expectStatus(200);

      const updatedAdminCompetency = JSON.parse(JSON.stringify(response.body));
      expect(updatedAdminCompetency).not.toBeNull();
      expect(updatedAdminCompetency.message).toEqual(
        `Successfully updated admin-competency competency id #${testData.competencyId}`
      );
      expect(updatedAdminCompetency.data.competencyId).toEqual(
        testData.competencyId
      );
      expect(updatedAdminCompetency.data.name).toBeDefined();
      expect(updatedAdminCompetency.data.description).toBeDefined();
    });
  });

  describe("AdminCompetencyController  remove()", () => {
    it("should delete an admin competency by id", async () => {
      const testData = {
        competencyId: 5,
      };
      const response = await pactum
        .spec()
        .delete(`/admin-competency/${testData.competencyId}`)
        .withPathParams({
          competencyId: testData.competencyId,
        })
        .expectStatus(200);
      const deletedAdminCompetency = JSON.parse(JSON.stringify(response.body));
      console.log("deletedAdminCompetency", deletedAdminCompetency);

      expect(deletedAdminCompetency).not.toBeNull();
      expect(deletedAdminCompetency.message).toEqual(
        `Successfully deleted admin-competency competency id #${testData.competencyId}`
      );
      expect(deletedAdminCompetency.data).toHaveProperty("id");
      expect(deletedAdminCompetency.data.competencyId).toEqual(
        testData.competencyId
      );
      expect(deletedAdminCompetency.data.name).toBeDefined();
      expect(deletedAdminCompetency.data.competencyLevels).toBeDefined();
      expect(deletedAdminCompetency?.data.description).toBeDefined();
      expect(deletedAdminCompetency?.data.createdAt).toBeDefined();
      expect(deletedAdminCompetency?.data.updatedAt).toBeDefined();
    });
  });
});
