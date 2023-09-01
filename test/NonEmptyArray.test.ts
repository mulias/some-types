import { NonEmptyArray, nonEmptyArray } from "../lib/NonEmptyArray";

describe("Constructors", () => {
  it("should create NonEmptyArray values", () => {
    expect(nonEmptyArray(0)).toStrictEqual([0]);
    expect(nonEmptyArray(0, [])).toStrictEqual([0]);
    expect(nonEmptyArray(undefined, [null])).toStrictEqual([undefined, null]);
    expect(NonEmptyArray.of(0)).toStrictEqual([0]);
    expect(NonEmptyArray.of(0, [1, 2, 3])).toStrictEqual([0, 1, 2, 3]);
  });
});
