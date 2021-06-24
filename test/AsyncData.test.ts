import { NotAsked, Loading, Success, Failure, FailureData, of } from "../AsyncData";

describe("Constructors", () => {
  it("should create AsyncData values", () => {
    expect(typeof NotAsked).toBe("symbol");
    expect(typeof Loading).toBe("symbol");
    expect(NotAsked).not.toEqual(Loading);
    expect(Success(1)).toBe(1);
    expect(Failure() instanceof Error).toBe(true);
    expect(FailureData("oops") instanceof Error).toBe(true);
    expect(FailureData("oops").data).toBe("oops");
    expect(of("yay!")).toBe("yay!");
  });
});
