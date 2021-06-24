import { Tuple, Empty, Single, Pair, Triple, of } from "../Tuple";

describe("Constructors", () => {
  it("should create Tuple values", () => {
    expect(Tuple()).toStrictEqual([]);
    expect(Tuple(1)).toStrictEqual([1]);
    expect(Tuple(1, "two")).toStrictEqual([1, "two"]);
    expect(Tuple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Empty).toStrictEqual([]);
    expect(Single(1)).toStrictEqual([1]);
    expect(Pair(1, "two")).toStrictEqual([1, "two"]);
    expect(Triple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(of()).toStrictEqual([]);
    expect(of(1)).toStrictEqual([1]);
    expect(of(1, "two")).toStrictEqual([1, "two"]);
    expect(of(1, "two", false)).toStrictEqual([1, "two", false]);
  });
});
