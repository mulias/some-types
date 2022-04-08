import { dataError, of, DataError } from "../DataError";

describe("Constructors", () => {
  it("should create DataError values", () => {
    expect(dataError(12) instanceof Error).toBe(true);
    expect(dataError(12) instanceof DataError).toBe(true);
    expect(dataError("oops").data).toBe("oops");
    expect(of("yay!") instanceof Error).toBe(true);
    expect(of("yay!") instanceof DataError).toBe(true);
    expect(of("yay!").data).toBe("yay!");
  });
});
