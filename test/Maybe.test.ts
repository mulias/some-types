import { just, nothing, of } from "../Maybe";

describe("Constructors", () => {
  it("should create Maybe values", () => {
    expect(just(1)).toBe(1);
    expect(nothing).toBe(undefined);
    expect(of("yay!")).toBe("yay!");
  });
});
