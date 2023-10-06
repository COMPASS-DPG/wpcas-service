import { Test, TestingModule } from "@nestjs/testing";
import { MockLevelController } from "./mock-level.controller";
import { MockLevelService } from "./mock-level.service";

describe("MockLevelController", () => {
  let controller: MockLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockLevelController],
      providers: [MockLevelService],
    }).compile();

    controller = module.get<MockLevelController>(MockLevelController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
