import { DateString, dateString, parse, toDate } from "../lib/DateString";

test("Constructors", () => {
  expect(dateString(0)).toBe("1970-01-01T00:00:00.000Z");
  expect(DateString.of(0)).toBe("1970-01-01T00:00:00.000Z");
  expect(dateString(999)).toBe("1970-01-01T00:00:00.999Z");
  expect(() => dateString(NaN)).toThrow(RangeError);
  expect(() => dateString(Math.pow(2, 53))).toThrow(RangeError);
  expect(dateString("2000-12-25")).toBe("2000-12-25T00:00:00.000Z");
  expect(
    dateString({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: false }),
  ).toBe("1990-06-02T14:00:00.000Z");
  expect(
    dateString({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: true }),
  ).toBe("1990-06-02T09:00:00.000Z");
  expect(() => dateString("Nope")).toThrow(RangeError);

  expect(parse(0)).toBe("1970-01-01T00:00:00.000Z");
  expect(parse(999)).toBe("1970-01-01T00:00:00.999Z");
  expect(parse(NaN)).toBeUndefined();
  expect(parse(Math.pow(2, 53))).toBeUndefined();
  expect(parse("2000-12-25")).toBe("2000-12-25T00:00:00.000Z");
  expect(
    parse({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: false }),
  ).toBe("1990-06-02T14:00:00.000Z");
  expect(
    parse({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: true }),
  ).toBe("1990-06-02T09:00:00.000Z");
  expect(parse("Nope")).toBeUndefined();
});
