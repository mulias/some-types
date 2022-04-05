import { tuple, empty, single, pair, triple, of } from "../Tuple";

describe("Constructors", () => {
  it("should create Tuple values", () => {
    expect(tuple()).toStrictEqual([]);
    expect(tuple(1)).toStrictEqual([1]);
    expect(tuple(1, "two")).toStrictEqual([1, "two"]);
    expect(tuple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(empty).toStrictEqual([]);
    expect(single(1)).toStrictEqual([1]);
    expect(pair(1, "two")).toStrictEqual([1, "two"]);
    expect(triple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(of()).toStrictEqual([]);
    expect(of(1)).toStrictEqual([1]);
    expect(of(1, "two")).toStrictEqual([1, "two"]);
    expect(of(1, "two", false)).toStrictEqual([1, "two", false]);
  });
});
