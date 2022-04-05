import * as Maybe from "./Maybe";
import * as ValidDate from "./ValidDate";

export {
  // Types
  DateString,
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  T,
  // Constructors
  // DateString,
  // DateTimeString,
  // DateOnlyString,
  // DateMonthString,
  of,
  now,
  // Typeguards
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  // Conversions
  toFields,
  toDate,
  // Operations
  map,
  mapUnsafe,
  applyAsDate
};

//
// Types
//

/**
 * A string encoding of a Date, guaranteed to parse to a valid Date object. The
 * three encodings `DateTimeString`, `DateOnlyString`, and `DateMonthString`
 * all use the same ISO 8601 complient format, but truncated to different
 * levels of specificity. For example, a `DateOnlyString` is a valid
 * `DateTimeString`, but with the time value zeroed out. Time zones are not
 * supported.
 *
 * The format used is
 * ```
 * `YYYY-MM-DDThh:mm:ss.sss`
 * ```
 * For example `2021-12-10T08:25:00.000` or `0000-01-01T00:00:00.000`.
 */
type DateString = DateTimeString | DateOnlyString | DateMonthString;

/** Alias for the `DateString` type */
type T = DateString;

/**
 * String encoding of a Year-Month-Date-Time date. Values of this type can be
 * constructed with the `DateTimeString` function.
 */
type DateTimeString = string & { readonly __opaque__: IsDateTimeString };
enum IsDateTimeString {}

/**
 * String encoding of a Year-Month-Date date. When parsed as a Date the time
 * defaults to 00:00:00.000. Values of this type can be constructed with the
 * `DateOnlyString` function.
 */
type DateOnlyString = string & { readonly __opaque__: IsDateOnlyString };
enum IsDateOnlyString {}

/**
 * String encoding of a Year-Month date. When parsed as a Date the day
 * defaults to the first of the month, and time to 00:00:00.000. Values of this
 * type can be constructed with the `DateMonthString` function.
 */
type DateMonthString = string & { readonly __opaque__: IsDateMonthString };
enum IsDateMonthString {}

/* Fields encoded in all `DateString`s. */
type DateStringFields = {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

/* Fields needed to construct a `DateTimeString`. */
type DateTimeFieldsArg = {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
};

/* Fields needed to construct a `DateOnlyString`. */
type DateOnlyFieldsArg = {
  year: number;
  month: number;
  date: number;
};

/* Fields needed to construct a `DateMonthString`. */
type DateMonthFieldsArg = {
  year: number;
  month: number;
};

//
// Constructors
//

/**
 * Create a `DateTimeString`, `DateOnlyString`, or `DateMonthString` by
 * providing the necessary constituent parts. Alternativly, try to parse a
 * value that might represent a date into a `Maybe<DateTimeString>`, or parse a
 * `ValidDate` into a `DateTimeString`.
 */
function DateString(d: DateString | ValidDate.T): DateTimeString;
function DateString(d: string | number | Date): Maybe.T<DateTimeString>;
function DateString(d: DateTimeFieldsArg): Maybe.T<DateTimeString>;
function DateString(d: DateOnlyFieldsArg): Maybe.T<DateOnlyString>;
function DateString(d: DateMonthFieldsArg): Maybe.T<DateMonthString>;
function DateString(
  d:
    | DateString
    | ValidDate.T
    | string
    | number
    | Date
    | {
        year: number;
        month: number;
        date?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
        milliseconds?: number;
      }
) {
  if (d instanceof Date || typeof d !== "object") {
    return DateTimeString(d);
  } else {
    const { year, month, date, hours, minutes, seconds, milliseconds } = d;

    if (date != undefined && hours != undefined && minutes != undefined && seconds != undefined) {
      return DateTimeString({ year, month, date, hours, minutes, seconds, milliseconds });
    } else if (date != undefined) {
      return DateOnlyString({ year, month, date });
    } else {
      return DateMonthString({ year, month });
    }
  }
}

/**
 * Create a `DateTimeString` from an input that might encode a Date, or an
 * object with date-time fields. If the input is a `DateString` or `ValidDate`,
 * then the return type is `DateTimeString`. Otherwise the return type is
 * `Maybe.T<DateTimeString>`.
 */
function DateTimeString(d: DateString | ValidDate.T): DateTimeString;
function DateTimeString(d: string | number | Date | DateTimeFieldsArg): Maybe.T<DateTimeString>;
function DateTimeString(
  d: DateString | ValidDate.T | string | number | Date | DateTimeFieldsArg
): Maybe.T<DateTimeString> {
  let fields;
  if (d instanceof Object && "year" in d && "month" in d && "date" in d) {
    fields = { ...d, milliseconds: d.milliseconds ?? 0 };
  } else {
    fields = getDateStringFields(new Date(d));
  }
  return Maybe.fromPredicate(formatDateString(fields), isDateTimeString);
}

/**
 * Create a DateOnlyString from an input that might encode a Date, or an object
 * with date fields. If the input is a `DateString` or `ValidDate`, then the
 * return type is `DateOnlyString`. Otherwise the return type is
 * `Maybe.T<DateOnlyString>`.
 */
function DateOnlyString(d: DateString | ValidDate.T): DateOnlyString;
function DateOnlyString(d: string | number | Date | DateOnlyFieldsArg): Maybe.T<DateOnlyString>;
function DateOnlyString(d: DateString | ValidDate.T | string | number | Date | DateOnlyFieldsArg) {
  let fields;
  if (d instanceof Object && "year" in d && "month" in d && "date" in d) {
    fields = d;
  } else {
    fields = getDateStringFields(new Date(d));
  }
  const dateOnlyFields = { ...fields, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  return Maybe.fromPredicate(formatDateString(dateOnlyFields), isDateOnlyString);
}

/**
 * Create a DateMonthString from an input that might encode a Date, or an
 * object with date fields. If the input is a `DateString` or `ValidDate`, then
 * the return type is `DateMonthString`. Otherwise the return type is
 * `Maybe.T<DateMonthString>`.
 */
function DateMonthString(d: DateString | ValidDate.T): DateMonthString;
function DateMonthString(d: string | number | Date | DateMonthFieldsArg): Maybe.T<DateMonthString>;
function DateMonthString(
  d: DateString | ValidDate.T | string | number | Date | DateMonthFieldsArg
) {
  let fields;
  if (d instanceof Object && "year" in d && "month" in d) {
    fields = d;
  } else {
    fields = getDateStringFields(new Date(d));
  }

  const monthOnlyFields = { ...fields, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
  return Maybe.fromPredicate(formatDateString(monthOnlyFields), isDateMonthString);
}

/** Alias for the `DateString` constructor. */
const of = DateString;

const now = () => DateString(ValidDate.now());

//
// Typeguards
//

/** Typeguard for any string that encodes a valid date in the DateString format. */
const isDateString = (d: unknown): d is DateString => isDateTimeString(d);

/** Typeguard for any string that encodes a valid date in the DateString format. */
const isDateTimeString = (d: unknown): d is DateTimeString =>
  typeof d === "string" && dateStringRegex.test(d) && new Date(d).getTime() !== NaN;

/**
 * Typeguard for any string that encodes a valid date in the DateString format
 * where the time is 00:00:00.000.
 */
const isDateOnlyString = (d: unknown): d is DateOnlyString =>
  typeof d === "string" && dateStringRegex.test(d) && new Date(d).getTime() % 100000 === 0;

/**
 * Typeguard for any string that encodes a valid date in the DateString format
 * where the time is 00:00:00.000 and the date is the first of the month.
 */
const isDateMonthString = (d: unknown): d is DateMonthString => {
  if (typeof d !== "string" || !dateStringRegex.test(d)) return false;
  const date = new Date(d);
  return date.getTime() % 100000 === 0 && date.getDate() === 1;
};

//
// Conversions
//

/**
 * Parse a `DateString` into a `Date` object. Because the result is guaranteed
 * to be valid, we return a `ValidDate` type.
 */
const toDate = (d: DateString): ValidDate.T => ValidDate.of(d);

/**
 * Get the Date-related fields encoded in a `DateString`.
 */
const toFields = (d: DateString): DateStringFields => getDateStringFields(ValidDate.of(d));

//
// Operations
//

/**
 * Apply a function that expects a `Date` argument onto a `DateString`,
 * returning a `Maybe.T<DateString>`. If `fn` produces a `DateString`, return
 * that value. If `fn` produces a `Date`, convert it to a `DateString`. If `fn`
 * produces an invalid `Date`, return `Maybe.Nothing`.
 */
function map<R extends DateString>(dateString: DateString, fn: (d: Date) => R): R;
function map(dateString: DateString, fn: (d: Date) => ValidDate.T): DateString;
function map(dateString: DateString, fn: (d: Date) => Date): Maybe.T<DateString>;
function map(dateString: DateString, fn: (d: Date) => Date | DateString) {
  const r = fn(toDate(dateString));
  if (isDateString(r)) {
    return r;
  } else {
    return DateTimeString(r);
  }
}

/**
 * Apply a function that expects a `Date` argument onto a `DateString`,
 * returning a `Maybe.T<DateString>` cast as a `DateString`. In many cases we
 * can be confident that a date operation will succeed if the input is a valid
 * date, so it's expedient to circumvent the more conservative return type of
 * `map`.
 */
function mapUnsafe(dateString: DateString, fn: (d: Date) => Date): DateString {
  return map(dateString, fn) as DateString;
}

/**
 * Apply a function that expects a `Date` argument onto a `DateString`. Unlike `map`, the
 * result of applying `fn` might not be a new `DateString`.
 */
const applyAsDate = <R>(d: DateString, fn: (date: Date) => R): R => fn(toDate(d));

//
// Helpers
//

const getDateStringFields = (d: Date): DateStringFields => {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milliseconds = d.getMilliseconds();

  return { year, month, date, hours, minutes, seconds, milliseconds };
};

const leftPad = (s: string, n: number): string => {
  const diff = Math.max(n - s.length, 0);
  const padding = "0".repeat(diff);
  return padding + s;
};

const formatDateString = (d: DateStringFields): string => {
  const year = leftPad(String(d.year), 4);
  const month = leftPad(String(d.month), 2);
  const date = leftPad(String(d.date), 2);
  const hours = leftPad(String(d.hours), 2);
  const minutes = leftPad(String(d.minutes), 2);
  const seconds = leftPad(String(d.seconds), 2);
  const milliseconds = leftPad(String(d.milliseconds), 3);

  return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const dateStringRegex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d\.\d\d\d/;
