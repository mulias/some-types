import { DataError } from "../lib";
import { dataError } from "../lib/DataError";

describe("Constructors", () => {
  it("should create DataError values", () => {
    expect(dataError(12) instanceof Error).toBe(true);
    expect(dataError(12) instanceof DataError).toBe(true);
    expect(dataError("oops").data).toBe("oops");
    expect(dataError(123)).toMatchObject({
      message: "This Error contains details in the 'data' field",
      data: 123,
    });

    expect(DataError.of("yay!") instanceof Error).toBe(true);
    expect(DataError.of("yay!") instanceof DataError).toBe(true);
    expect(DataError.of("yay!").data).toBe("yay!");
    expect(DataError.of("not found", "Error: not found")).toMatchObject({
      message: "Error: not found",
      data: "not found",
    });
  });
});
