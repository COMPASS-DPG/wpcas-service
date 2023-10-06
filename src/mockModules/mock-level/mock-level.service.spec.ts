import { Test, TestingModule } from "@nestjs/testing";
import { MockLevelService } from "./mock-level.service";

describe("MockLevelService", () => {
  let service: MockLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockLevelService],
    }).compile();

    service = module.get<MockLevelService>(MockLevelService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
