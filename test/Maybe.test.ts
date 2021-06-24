import { Just, Nothing, of } from "../Maybe";

describe("Constructors", () => {
  it("should create Maybe values", () => {
    expect(Just(1)).toBe(1);
    expect(Nothing).toBe(undefined);
    expect(of("yay!")).toBe("yay!");
  });
});
