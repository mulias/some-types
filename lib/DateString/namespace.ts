import { Branded } from "../Branded/namespace";
import { Option } from "../Option/namespace";
import { Timestamp } from "../Timestamp/namespace";
import { ValidDate } from "../ValidDate/namespace";
import {
  LocalDateFields,
  NewDateArgs,
  UTCDateFields,
  getLocalDateFields,
  getUTCDateFields,
  newDate,
} from "../util/date";

/**
 *
 * Type: A `DateString` is a string encoding of a `Date`, guaranteed to parse
 * to a valid Date object. Internally `DateString`s use ISO 8601 format, which
 * is commonly used to communicate dates between systems.
 *
 * `DateString`s have many of the same benefits of `Timestamp`s, in that they
 * are immutable and use string value comparison instead of reference
 * comparison. Many date utility libraries will accept strings instead of
 * `Date`s, but libraries such as `date-fns` are less permissive and require
 * strings to first be explicitly parsed to dates.
 *
 */
export type DateString = Branded<string, typeof DateStringBrand>;

declare const DateStringBrand: unique symbol;

/**
 *
 * Namespace: The `DateString` namespace contains functions for `DateString`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace DateString {
  //
  // Constructors
  //

  /**
   * Create a `DateString` from a value that encodes a date. If the value can't
   * be interpreted as a valid date then throw an error.
   *
   * The input value can be a string, number, or Date, similar to the `Date`
   * object constructor. Alternatively, the input can be an object with fields
   * specifying `year`, `monthIndex`, `day`, and optionally `hours`, `minutes`,
   * `seconds`, `milliseconds`, and `utc`. The `utc` field is a boolean flag to
   * set if the date values should be interpreted in UTC time or local time.
   * The default is `false` for local time.
   *
   * This function is useful for cases where there is high confidence that the
   * input encodes a valid date. For cases where the input might not encode a
   * valid date use `DateString.parse` instead.
   */
  export function dateString(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): DateString {
    const s = parse(d);
    if (s !== undefined) {
      return s;
    } else {
      throw new RangeError("Value must encode a valid date");
    }
  }

  /**
   * Create a `DateString` from a value that encodes a date. If the value can't
   * be interpreted as a valid date then throw an error.
   *
   * This function is useful for cases where there is high confidence that the
   * input encodes a valid date. For cases where the input might not encode a
   * valid date use `DateString.parse` instead.
   */
  export const of = dateString;

  /**
   * Create a `DateString` from a value that might encode a date. If the value
   * can't be interpreted as a valid date then return `undefined`.
   *
   * This function is useful for cases where the input might not be a valid
   * date. If the input should be valid in all but the most exceptional of
   * cases then use `DateString.dateString` or `Datestring.of` instead.
   */
  export function parse(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): Option<DateString> {
    let date: Date;

    if (ValidDate.isType(d)) {
      date = ValidDate.asDate(d);
    } else if (d instanceof Date) {
      date = d;
    } else {
      date = newDate(d);
    }

    return isNaN(date.valueOf())
      ? undefined
      : (date.toISOString() as DateString);
  }

  /** Get the current time as a `DateString`. */
  export function now(): DateString {
    return dateString(Date.now());
  }

  //
  // Typeguards
  //

  /** Typeguard for any string that encodes a valid date in the `DateString` format. */
  export function isDateString(d: unknown): d is DateString {
    if (typeof d === "string") {
      const date = new Date(d);
      return !isNaN(date.valueOf()) && date.toISOString() === d;
    } else {
      return false;
    }
  }

  /** Typeguard for any string that encodes a valid date in the `DateString` format. */
  export const isType = isDateString;

  //
  // Conversions
  //

  /**
   * Parse a `DateString` into a `Date` object.
   */
  export function toDate(d: DateString): Date {
    return new Date(d);
  }

  /**
   * Parse a `DateString` into a `Date` object. The resulting date is
   * guaranteed to be valid, so we return a `ValidDate` type. In some cases it
   * is necessary to use `DateString.toDate` instead because `ValidDate`s are
   * read-only and can't be used when the mutable `Date` type is required.
   */
  export function toValidDate(d: DateString): ValidDate {
    return ValidDate.of(d);
  }

  /**
   * Convert a `DateString` into a `Timestamp`, a number encoding of the same
   * date value.
   */
  export function toTimestamp(d: DateString): Timestamp {
    return Timestamp.of(d);
  }

  /**
   * Get the Date-related fields encoded in a `DateString`, in the local
   * timezone.
   */
  export function localFields(d: DateString): LocalDateFields {
    return getLocalDateFields(toDate(d));
  }

  /**
   * Get the Date-related fields encoded in a `DateString`, in UTC.
   */
  export function utcFields(d: DateString): UTCDateFields {
    return getUTCDateFields(toDate(d));
  }

  /**
   * Assert that `d` is a `DateString`. If the assertion holds then return `d`
   * with an updated type. If the assertion fails throw an error.
   */
  export function coerceDateString(d: string): DateString {
    if (isDateString(d)) return d;
    throw new Error("Expected a DateString");
  }

  /**
   * Assert that `d` is a `DateString`. If the assertion holds then return `d`
   * with an updated type. If the assertion fails throw an error.
   */
  export const coerce = coerceDateString;

  //
  // Operations
  //

  /**
   * Take a function that expects a `Date` and returns a `Date`, and  apply it
   * to a `DateString`, returning a `DateString`.
   */
  export function map(
    ds: DateString,
    fn: (d: Date) => Date | ValidDate,
  ): DateString;
  export function map(
    ds: DateString,
    fn: (d: ValidDate) => Date | ValidDate,
  ): DateString;
  export function map(ds: DateString, fn: (d: any) => any) {
    return dateString(fn(toDate(ds)));
  }
}
