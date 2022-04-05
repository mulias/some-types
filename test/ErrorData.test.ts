import { errorData, of, ErrorData } from "../ErrorData";

describe("Constructors", () => {
  it("should create ErrorData values", () => {
    expect(errorData(12) instanceof Error).toBe(true);
    expect(errorData(12) instanceof ErrorData).toBe(true);
    expect(errorData("oops").data).toBe("oops");
    expect(of("yay!") instanceof Error).toBe(true);
    expect(of("yay!") instanceof ErrorData).toBe(true);
    expect(of("yay!").data).toBe("yay!");
  });
});
