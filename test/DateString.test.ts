import * as Maybe from "../Maybe";
import {
  DateString,
  T,
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  toDate,
  map
} from "../DateString";

describe("Constructors", () => {
  it("should", () => {
    const dts = "2015-01-11T20:10:03";
    const dos = "2015-01-11T00:00:00";
    const dms = "2015-01-01T00:00:00";
    const d = new Date(dts);

    expect(DateTimeString(d)).toBe(dts);
    expect(DateOnlyString(d)).toBe(dos);
    expect(DateMonthString(d)).toBe(dms);

    expect(DateTimeString(dts)).toBe(dts);
    expect(DateOnlyString(dts)).toBe(dos);
    expect(DateMonthString(dts)).toBe(dms);

    expect(DateTimeString(dos)).toBe(dos);
    expect(DateOnlyString(dos)).toBe(dos);
    expect(DateMonthString(dos)).toBe(dms);

    expect(DateTimeString(dms)).toBe(dms);
    expect(DateOnlyString(dms)).toBe(dms);
    expect(DateMonthString(dms)).toBe(dms);

    expect(Maybe.map(DateTimeString, DateTimeString(d))).toBe(dts);
    expect(Maybe.map(DateTimeString, DateOnlyString(d))).toBe(dos);
    expect(Maybe.map(DateTimeString, DateMonthString(d))).toBe(dms);

    expect(DateTimeString("Jan 21 1993")).toBe("1993-01-21T00:00:00");
    expect(DateTimeString("Jan 21 1993 at 12:57")).toBeUndefined();

    const utcString = dts + "Z";
    expect(DateTimeString(utcString)).toBeDefined();
    expect(DateTimeString(utcString)).not.toBe(dts);
  });
});
