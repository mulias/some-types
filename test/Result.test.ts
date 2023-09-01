import { DataError } from "../lib";
import { Result, Ok, Err, ok, err, errData } from "../lib/Result";

describe("Constructors", () => {
  it("should create Result values", () => {
    expect(ok(1)).toBe(1);
    expect(Result.ok(1)).toBe(1);
    expect(Result.of(1)).toBe(1);
    expect(Ok.of(1)).toBe(1);
    expect(Result.Ok.of(1)).toBe(1);
    expect(err() instanceof Error).toBe(true);
    expect(Result.err() instanceof Error).toBe(true);
    expect(err("oops") instanceof Error).toBe(true);
    expect(Result.Err.of("oops") instanceof Error).toBe(true);
    expect(errData("oops").data).toBe("oops");
    expect(Err.withData("oops").data).toBe("oops");
    expect(Result.of("yay!")).toBe("yay!");
  });
});

test("README examples", () => {
  const validateNumber = (n: number): Result<number, DataError<number>> => {
    if (n === 5) return Result.errData(n, "I don't like 5");
    if (n < 0) return Result.errData(n, "can't be negative");
    if (n === 55) return Result.errData(n, "I don't like 55 either");
    if (n % 2 !== 1) return Result.errData(n, "must be odd");

    return n;
  };

  const validateNumbers = (ns: number[]): Result<number[], DataError<number>> =>
    Result.consolidate(ns.map(validateNumber));

  const submit = (ns: number[]): string => {
    const result = validateNumbers(ns);

    if (Result.isOk(result)) {
      const sum = result.reduce((acc, n) => acc + n);
      return `Thanks for these great numbers! Their sum is ${sum}.`;
    } else {
      return `Error: Invalid number ${result.data}, ${result.message}.`;
    }
  };

  const validNumbers = [1, 3, 7, 9, 11];
  const invalidNumbers = [1, 3, 7, 12, 55, -1];

  expect(validateNumbers(validNumbers)).toStrictEqual(validNumbers);
  expect(validateNumbers(invalidNumbers)).toBeInstanceOf(Error);
  expect(validateNumbers(invalidNumbers)).toMatchObject({
    data: 12,
    message: "must be odd",
  });

  expect(submit(validNumbers)).toBe(
    "Thanks for these great numbers! Their sum is 31.",
  );
  expect(submit(invalidNumbers)).toBe("Error: Invalid number 12, must be odd.");
});
