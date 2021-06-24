import { ValidDate, now, of } from "../ValidDate";

describe("Constructors", () => {
  it("should create ValidDate values", () => {
    const dts = "2015-01-11T20:10:03";
    const d = new Date(dts);

    expect(ValidDate(dts) instanceof Date).toBe(true);
    expect(ValidDate(d) instanceof Date).toBe(true);
    expect(now() instanceof Date).toBe(true);
    expect(of(dts) instanceof Date).toBe(true);
    expect(of(d) instanceof Date).toBe(true);
  });
});
