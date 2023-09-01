import { Option, Some, None, some, none } from "../lib/Option";

describe("Constructors", () => {
  it("should create Option values", () => {
    expect(some(1)).toBe(1);
    expect(Option.some(1)).toBe(1);
    expect(Option.of("yay!")).toBe("yay!");
    expect(Some.of("yay!")).toBe("yay!");
    expect(Option.Some.of("yay!")).toBe("yay!");

    expect(none).toBe(undefined);
    expect(Option.none).toBe(undefined);
    expect(None.value).toBe(undefined);
  });
});

test("README examples", () => {
  const inc = (x: number) => x + 1;

  let num: Option<number> = 10;

  const withTernary: Option<number> = num !== undefined ? inc(num) : num;
  const withOption: Option<number> = Option.ifSome(num, inc);

  expect(withTernary).toBe(11);
  expect(withOption).toBe(11);

  expect(Option.ifSome(5, inc)).toBe(6);
  expect(Option.ifSome(some(12), inc)).toBe(13);
  expect(Option.ifSome(undefined, inc)).toBe(undefined);
  expect(Option.ifSome(none, inc)).toBe(undefined);

  const assertPositive = (n: number) => {
    if (n > 0) return n;
    throw "Not a positive number!";
  };

  const keepPositive = Option.encase(assertPositive);

  const a = keepPositive(10);
  const b = keepPositive(-5);

  expect(a).toBe(10);
  expect(b).toBe(none);
});
