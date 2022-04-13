import { notAsked, loading, success, failure, failureData, of } from "../RemoteData";

describe("Constructors", () => {
  it("should create RemoteData values", () => {
    expect(typeof notAsked).toBe("symbol");
    expect(typeof loading).toBe("symbol");
    expect(notAsked).not.toEqual(loading);
    expect(success(1)).toBe(1);
    expect(failure() instanceof Error).toBe(true);
    expect(failureData("oops") instanceof Error).toBe(true);
    expect(failureData("oops").data).toBe("oops");
    expect(of("yay!")).toBe("yay!");
  });
});
