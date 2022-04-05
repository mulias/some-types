import * as Maybe from "../Maybe";
import {
  DateString,
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  T,
  dateString,
  dateTimeString,
  dateOnlyString,
  dateMonthString,
  of,
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  toDate,
  map
} from "../DateString";

describe("Constructors", () => {
  it("should create DateString values", () => {
    const dts = "2015-01-11T20:10:03.000";
    const dos = "2015-01-11T00:00:00.000";
    const dms = "2015-01-01T00:00:00.000";
    const d = new Date(dts);

    expect(
      dateString({
        year: 2015,
        month: 1,
        date: 11,
        hours: 20,
        minutes: 10,
        seconds: 3
      })
    ).toBe(dts);
    expect(dateString({ year: 2015, month: 1, date: 11 })).toBe(dos);
    expect(dateString({ year: 2015, month: 1 })).toBe(dms);

    expect(dateTimeString(d)).toBe(dts);
    expect(dateOnlyString(d)).toBe(dos);
    expect(dateMonthString(d)).toBe(dms);

    expect(dateTimeString(dts)).toBe(dts);
    expect(dateOnlyString(dts)).toBe(dos);
    expect(dateMonthString(dts)).toBe(dms);

    expect(dateTimeString(dos)).toBe(dos);
    expect(dateOnlyString(dos)).toBe(dos);
    expect(dateMonthString(dos)).toBe(dms);

    expect(dateTimeString(dms)).toBe(dms);
    expect(dateOnlyString(dms)).toBe(dms);
    expect(dateMonthString(dms)).toBe(dms);

    expect(Maybe.map(dateTimeString(d), dateTimeString)).toBe(dts);
    expect(Maybe.map(dateOnlyString(d), dateTimeString)).toBe(dos);
    expect(Maybe.map(dateMonthString(d), dateTimeString)).toBe(dms);

    expect(dateTimeString("Jan 21 1993")).toBe("1993-01-21T00:00:00.000");
    expect(dateTimeString("Jan 21 1993 at 12:57")).toBeUndefined();

    const utcString = dts + "Z";
    expect(dateTimeString(utcString)).toBeDefined();
    expect(dateTimeString(utcString)).not.toBe(dts);
  });
});
