import { Ok, Err, ErrData, of } from "../Result";

describe("Constructors", () => {
  it("should create Result values", () => {
    expect(Ok(1)).toBe(1);
    expect(Err() instanceof Error).toBe(true);
    expect(Err("oops") instanceof Error).toBe(true);
    expect(ErrData("oops").data).toBe("oops");
    expect(of("yay!")).toBe("yay!");
  });
});
