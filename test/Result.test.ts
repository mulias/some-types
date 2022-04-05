import { ok, err, errData, of } from "../Result";

describe("Constructors", () => {
  it("should create Result values", () => {
    expect(ok(1)).toBe(1);
    expect(err() instanceof Error).toBe(true);
    expect(err("oops") instanceof Error).toBe(true);
    expect(errData("oops").data).toBe("oops");
    expect(of("yay!")).toBe("yay!");
  });
});
