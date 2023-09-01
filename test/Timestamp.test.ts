import { isMonday } from "date-fns";
import { Option, ValidDate } from "../lib";
import { Timestamp, timestamp, parse, toDate } from "../lib/Timestamp";

test("Constructors", () => {
  expect(timestamp(0)).toBe(0);
  expect(timestamp(999)).toBe(999);
  expect(() => timestamp(NaN)).toThrow(RangeError);
  expect(() => timestamp(Math.pow(2, 53))).toThrow(RangeError);
  expect(timestamp("1970-01-01")).toBe(0);
  expect(
    timestamp({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: false }),
  ).toBe(644335200000);
  expect(
    timestamp({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: true }),
  ).toBe(644317200000);
  expect(() => timestamp("Nope")).toThrow(RangeError);

  expect(parse(0)).toBe(0);
  expect(parse(999)).toBe(999);
  expect(parse(NaN)).toBeUndefined();
  expect(parse(Math.pow(2, 53))).toBeUndefined();
  expect(parse("1970-01-01")).toBe(0);
  expect(
    parse({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: false }),
  ).toBe(644335200000);
  expect(
    parse({ year: 1990, monthIndex: 5, day: 2, hours: 9, utc: true }),
  ).toBe(644317200000);
  expect(parse("Nope")).toBeUndefined();
});

test("README example", () => {
  const year = 2023;
  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex) =>
    timestamp({ year, monthIndex, day: 1 }),
  );

  expect(months).toStrictEqual([
    1672549200000, 1675227600000, 1677646800000, 1680325200000, 1682917200000,
    1685595600000, 1688187600000, 1690866000000, 1693544400000, 1696136400000,
    1698814800000, 1701406800000,
  ]);

  const monthsStartingOnMonday = months.filter(isMonday);

  expect(monthsStartingOnMonday).toStrictEqual([1682917200000]);
  expect(
    monthsStartingOnMonday.map((t) => toDate(t).toUTCString()),
  ).toStrictEqual(["Mon, 01 May 2023 05:00:00 GMT"]);
});
