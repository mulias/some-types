import * as Maybe from "./Maybe";
import * as ValidDate from "./ValidDate";

export {
  // Types
  DateString,
  T,
  // Constructors
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  // Typeguards
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  // Conversions
  toDate,
  // Operations
  map
};

//
// Types
//

/** A string encoding of a Date, guaranteed to parse to a valid Date object. */
type DateString = DateOnlyString | DateTimeString | DateMonthString;

/** Alias for the `DateString` type */
type T = DateString;

/**
 * String encoding of a Year-Month-Day-Time date. Values of this type can be
 * constructed with the `DateTimeString` function.
 */
type DateTimeString = string & IsDateTimeString;
enum IsDateTimeString {
  _ = "DATE_TIME_STRING"
}

/**
 * String encoding of a Year/Month/Day date. When parsed as a Date the time
 * defaults to 00:00:00. Values of this type can be constructed with the
 * `DateOnlyString` function.
 */
type DateOnlyString = string & IsDateOnlyString;
enum IsDateOnlyString {
  _ = "DATE_ONLY_STRING"
}

/**
 * String encoding of a Year-Month date. When parsed as a Date the day
 * defaults to the first of the month, and time to 00:00:00. Values of this
 * type can be constructed with the `DateMonthString` function.
 */
type DateMonthString = string & IsDateMonthString;
enum IsDateMonthString {
  _ = "DATE_MONTH_STRING"
}

//
// Constructors
//

/**
 * Create a DateTimeString from an input that might encode a Date. If the input
 * is a `DateString` or `ValidDate`, then the return type is `DateTimeString`.
 * Otherwise the return type is `Maybe<DateTimeString>`.
 */
function DateTimeString<D extends DateString | ValidDate.T>(d: D): DateTimeString;
function DateTimeString<D extends Date | string | number>(d: D): Maybe.T<DateTimeString>;
function DateTimeString(d: DateString | ValidDate.T | Date | string | number) {
  if (d instanceof Date && !ValidDate.isValidDate(d)) return undefined;

  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  return date.toISOString();
}

/**
 * Create a DateOnlyString from an input that might encode a Date. If the input
 * is a `DateString` or `ValidDate`, then the return type is `DateOnlyString`.
 * Otherwise the return type is `Maybe<DateOnlyString>`.
 */
function DateOnlyString<D extends DateString | ValidDate.T>(d: D): DateOnlyString;
function DateOnlyString<D extends Date | string | number>(d: D): Maybe.T<DateOnlyString>;
function DateOnlyString(d: DateString | ValidDate.T | Date | string | number) {
  if (d instanceof Date && !ValidDate.isValidDate(d)) return undefined;

  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}T00:00:00Z`;
}

/**
 * Create a DateMonthString from an input that might encode a Date. If the input
 * is a `DateString` or `ValidDate`, then the return type is `DateMonthString`.
 * Otherwise the return type is `Maybe<DateMonthString>`.
 */
function DateMonthString<D extends DateString | ValidDate.T>(d: D): DateMonthString;
function DateMonthString<D extends Date | string | number>(d: D): Maybe.T<DateMonthString>;
function DateMonthString(d: DateString | ValidDate.T | Date | string | number) {
  if (d instanceof Date && !ValidDate.isValidDate(d)) return undefined;

  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return `${year}-${month}-01T00:00:00Z`;
}

//
// Typeguards
//

/** Typeguard for any string that parses to a valid Date. */
const isDateString = (d: unknown): d is DateString => isDateTimeString(d);

/** Typeguard for any string that parses to a valid Date. */
const isDateTimeString = (d: unknown): d is DateTimeString => {
  if (typeof d !== "string") return false;
  const dateTime = new Date(d).getTime();
  return dateTime !== NaN;
};

/**
 * Typeguard for any string that parses to a valid Date where the time is
 * 00:00:00.
 */
const isDateOnlyString = (d: unknown): d is DateOnlyString => {
  if (typeof d !== "string") return false;
  const dateTime = new Date(d).getTime();
  return dateTime !== NaN && dateTime % 100000 === 0;
};

/**
 * Typeguard for any string that parses to a valid Date where the time is
 * 00:00:00 and the day is the first of the month.
 */
const isDateMonthString = (d: unknown): d is DateMonthString => {
  if (typeof d !== "string") return false;
  const date = new Date(d);
  const dateTime = date.getTime();
  return dateTime !== NaN && dateTime % 100000 === 0 && date.getDate() === 1;
};

//
// Conversions
//

/**
 * Parse a `DateString` into a `Date` object. Because the result is guaranteed
 * to be valid, we return a `ValidDate` type.
 */
const toDate = (d: DateString): ValidDate.T => new Date(d) as ValidDate.T;

//
// Operations
//

/**
 * Apply a `Date` object operation onto a `DateString`, and try to return the
 * result as a `DateTimeString`. If applying `fn` produces an invalid date,
 * then `Nothing` is returned.
 */
const map = (fn: (d: Date) => Date, ds: DateString): Maybe.T<DateTimeString> =>
  DateTimeString(fn(toDate(ds)));
