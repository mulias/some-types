import {
  Tuple,
  Empty,
  Single,
  Pair,
  Triple,
  tuple,
  empty,
  single,
  pair,
  triple,
} from "../lib/Tuple";

describe("Constructors", () => {
  it("should create Tuple values", () => {
    expect(tuple()).toStrictEqual([]);
    expect(tuple(1)).toStrictEqual([1]);
    expect(tuple(1, "two")).toStrictEqual([1, "two"]);
    expect(tuple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Tuple.tuple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Tuple.of()).toStrictEqual([]);
    expect(Tuple.of(1)).toStrictEqual([1]);
    expect(Tuple.of(1, "two")).toStrictEqual([1, "two"]);
    expect(Tuple.of(1, "two", false)).toStrictEqual([1, "two", false]);

    expect(empty).toStrictEqual([]);
    expect(Tuple.empty).toStrictEqual([]);
    expect(Empty.value).toStrictEqual([]);
    expect(Tuple.Empty.value).toStrictEqual([]);

    expect(single(1)).toStrictEqual([1]);
    expect(Tuple.single(1)).toStrictEqual([1]);
    expect(Single.of(1)).toStrictEqual([1]);
    expect(Tuple.Single.of(1)).toStrictEqual([1]);

    expect(pair(1, "two")).toStrictEqual([1, "two"]);
    expect(Tuple.pair(1, "two")).toStrictEqual([1, "two"]);
    expect(Pair.of(2, "three")).toStrictEqual([2, "three"]);
    expect(Tuple.Pair.of(2, "three")).toStrictEqual([2, "three"]);

    expect(triple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Tuple.triple(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Triple.of(1, "two", false)).toStrictEqual([1, "two", false]);
    expect(Tuple.Triple.of(1, "two", false)).toStrictEqual([1, "two", false]);
  });
});

test("README example", () => {
  const nums = [1, 2, 3];
  const chars = ["a", "b", "c"];

  const pairs = Tuple.zip(nums, chars);

  const firstNumber = pairs[0]?.[0];
  const firstString = pairs[0]?.[1];

  const joined = pairs.map((p) => p.join());

  expect(pairs).toStrictEqual([
    [1, "a"],
    [2, "b"],
    [3, "c"],
  ]);

  expect(firstNumber).toBe(1);
  expect(firstString).toBe("a");

  expect(joined).toStrictEqual(["1,a", "2,b", "3,c"]);
});
