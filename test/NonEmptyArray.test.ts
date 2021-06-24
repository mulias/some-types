import { NonEmptyArray, of } from "../NonEmptyArray";

describe("Constructors", () => {
  it("should create NonEmptyArray values", () => {
    expect(NonEmptyArray(0)).toStrictEqual([0]);
    expect(NonEmptyArray(0, [])).toStrictEqual([0]);
    expect(NonEmptyArray(undefined, [null])).toStrictEqual([undefined, null]);
    expect(of(0)).toStrictEqual([0]);
    expect(of(0, [1, 2, 3])).toStrictEqual([0, 1, 2, 3]);
  });
});
