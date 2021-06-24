import { ErrorData, of } from "../ErrorData";

describe("Constructors", () => {
  it("should create ErrorData values", () => {
    expect(new ErrorData(12) instanceof Error).toBe(true);
    expect(new ErrorData(12) instanceof ErrorData).toBe(true);
    expect(new ErrorData("oops").data).toBe("oops");
    expect(of("yay!") instanceof Error).toBe(true);
    expect(of("yay!") instanceof ErrorData).toBe(true);
    expect(of("yay!").data).toBe("yay!");
  });
});
