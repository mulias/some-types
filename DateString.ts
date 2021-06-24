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
  of,
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

/**
 * A string encoding of a Date, guaranteed to parse to a valid Date object. The
 * three encodings provided store date information at different levels of
 * specificity, but are not mutually exclusive. For example, a `DateOnlyString`
 * is a valid `DateTimeString`, but with the time value zeroed out.
 */
type DateString = DateTimeString | DateOnlyString | DateMonthString;

/** Alias for the `DateString` type */
type T = DateString;

/**
 * String encoding of a Year-Month-Day-Time date. Values of this type can be
 * constructed with the `DateTimeString` function.
 */
type DateTimeString = string & { readonly __opaque__: IsDateTimeString };
enum IsDateTimeString {}

/**
 * String encoding of a Year/Month/Day date. When parsed as a Date the time
 * defaults to 00:00:00. Values of this type can be constructed with the
 * `DateOnlyString` function.
 */
type DateOnlyString = string & { readonly __opaque__: IsDateOnlyString };
enum IsDateOnlyString {}

/**
 * String encoding of a Year-Month date. When parsed as a Date the day
 * defaults to the first of the month, and time to 00:00:00. Values of this
 * type can be constructed with the `DateMonthString` function.
 */
type DateMonthString = string & { readonly __opaque__: IsDateMonthString };
enum IsDateMonthString {}

type NaiveDateTimeFields = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
};

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
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  const fields = getNaiveDateTimeFields(date);
  return Maybe.map(formatDateString, fields);
}

/**
 * Create a DateOnlyString from an input that might encode a Date. If the input
 * is a `DateString` or `ValidDate`, then the return type is `DateOnlyString`.
 * Otherwise the return type is `Maybe<DateOnlyString>`.
 */
function DateOnlyString<D extends DateString | ValidDate.T>(d: D): DateOnlyString;
function DateOnlyString<D extends Date | string | number>(d: D): Maybe.T<DateOnlyString>;
function DateOnlyString(d: DateString | ValidDate.T | Date | string | number) {
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  const dateOnlyFields = Maybe.map(
    (fields) => ({ ...fields, hours: 0, minutes: 0, seconds: 0 }),
    getNaiveDateTimeFields(date)
  );
  return Maybe.map(formatDateString, dateOnlyFields);
}

/**
 * Create a DateMonthString from an input that might encode a Date. If the input
 * is a `DateString` or `ValidDate`, then the return type is `DateMonthString`.
 * Otherwise the return type is `Maybe<DateMonthString>`.
 */
function DateMonthString<D extends DateString | ValidDate.T>(d: D): DateMonthString;
function DateMonthString<D extends Date | string | number>(d: D): Maybe.T<DateMonthString>;
function DateMonthString(d: DateString | ValidDate.T | Date | string | number) {
  const date = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  const monthOnlyFields = Maybe.map(
    (fields) => ({ ...fields, day: 1, hours: 0, minutes: 0, seconds: 0 }),
    getNaiveDateTimeFields(date)
  );
  return Maybe.map(formatDateString, monthOnlyFields);
}

/** Alias for the `DateTimeString` constructor. */
const of = DateTimeString;

//
// Typeguards
//

/** Typeguard for any string that parses to a valid Date. */
const isDateString = (d: unknown): d is DateString => isDateTimeString(d);

/** Typeguard for any string that parses to a valid Date. */
const isDateTimeString = (d: unknown): d is DateTimeString =>
  typeof d === "string" && dateStringRegex.test(d) && new Date(d).getTime() !== NaN;

/**
 * Typeguard for any string that parses to a valid Date where the time is
 * 00:00:00.
 */
const isDateOnlyString = (d: unknown): d is DateOnlyString =>
  isDateTimeString(d) && new Date(d).getTime() % 100000 === 0;

/**
 * Typeguard for any string that parses to a valid Date where the time is
 * 00:00:00 and the day is the first of the month.
 */
const isDateMonthString = (d: unknown): d is DateMonthString => {
  if (!isDateTimeString(d)) return false;
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
const toDate = (d: DateString): ValidDate.T => new Date(d) as ValidDate.T;

//
// Operations
//

/**
 * Apply a `Date` object operation onto one or more `DateString`s, returning a
 * new `DateString`. If `fn` produces a `DateString`, return that value. If
 * `fn` produces a `Date`, convert it to a `DateString`. If `fn` produces
 * an invalid `Date`, return `Maybe.Nothing`.
 */
function map<R extends DateString>(fn: (d: Date) => R, dateString: DateString): R;
function map(fn: (d: Date) => ValidDate.T, dateString: DateString): DateString;
function map(fn: (d: Date) => Date, dateString: DateString): Maybe.T<DateString>;
function map(fn: (d: Date) => Date | DateString, dateString: DateString) {
  const r = fn(toDate(dateString));
  if (isDateString(r)) {
    return r;
  } else {
    return DateTimeString(r);
  }
}

/**
 * Apply a `Date` operation to one or more `DateString`s. Unlike `map`, the
 * result of applying `fn` might not be a new `DateString`.
 */
function applyAsDate<R>(fn: (date: ValidDate.T) => R, d: DateString | ValidDate.T): R;
function applyAsDate<R>(fn: (date: Date) => R, d: DateString | Date): R;
function applyAsDate(fn: (date: any) => any, d: DateString | ValidDate.T | Date) {
  return fn(d instanceof Date ? d : toDate(d));
}

//
// Helpers
//

const getNaiveDateTimeFields = (d: Date): Maybe.T<NaiveDateTimeFields> => {
  if (!ValidDate.isValidDate(d)) return undefined;

  const year = d.getFullYear();
  if (year < 0 || year > 9999) return undefined;

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();

  return { year, month, day, hours, minutes, seconds };
};

const leftPad = (n: number, s: string): string => {
  const diff = Math.max(n - s.length, 0);
  const padding = "0".repeat(diff);
  return padding + s;
};

const formatDateString = (d: NaiveDateTimeFields): string => {
  const year = leftPad(4, String(d.year));
  const month = leftPad(2, String(d.month));
  const day = leftPad(2, String(d.day));
  const hours = leftPad(2, String(d.hours));
  const minutes = leftPad(2, String(d.minutes));
  const seconds = leftPad(2, String(d.seconds));

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const dateStringRegex = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/;
