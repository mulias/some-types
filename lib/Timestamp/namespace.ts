import { Branded } from "../Branded/namespace";
import { DateString } from "../DateString/namespace";
import { Option } from "../Option/namespace";
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
 * Type: A `Timestamp` is a number encoding of a `Date`, measured as the time
 * in milliseconds that has elapsed since the UNIX epoch.
 *
 * The JavaScript `Date` object uses an integer timestamp for its internal
 * representation, so `Timestamp` values map directly to valid `Date`s. Unlike
 * `Date`s timestamps are immutable, can be compared by value, and are easy to
 * sort. Many date utility libraries will accept timestamps instead of `Date`s
 * as function arguments, so in many cases `Timestamp`s can be used as a
 * drop-in replacement for `Date`s.
 *
 */
export type Timestamp = Branded<number, typeof TimestampBrand>;

declare const TimestampBrand: unique symbol;

/**
 *
 * Namespace: The `Timestamp` namespace contains functions for `Timestamp`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace Timestamp {
  //
  // Constructors
  //

  /**
   * Create a `Timestamp` from a value that encodes a date. If the value
   * can't be interpreted as a valid date then throw an error.
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
   * valid date use `Timestamp.parse` instead.
   */
  export function timestamp(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): Timestamp {
    const t = parse(d);
    if (t !== undefined) {
      return t;
    } else {
      throw new RangeError("value must encode a valid date");
    }
  }

  /**
   * Create a `Timestamp` from a value that encodes a date. If the value
   * can't be interpreted as a valid date then throw an error.
   *
   * This function is useful for cases where there is high confidence that the
   * input encodes a valid date. For cases where the input might not encode a
   * valid date use `Timestamp.parse` instead.
   */
  export const of = timestamp;

  /**
   * Create a `Timestamp` from a value that might encode a date. If the value
   * can't be interpreted as a valid date then return `undefined`.
   *
   * This function is useful for cases where the input might not be a valid
   * date. If the input should be valid in all but the most exceptional of
   * cases then use `Timestamp.timestamp` or `Timestamp.of` instead.
   */
  export function parse(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): Option<Timestamp> {
    let date: Date;

    if (ValidDate.isType(d)) {
      date = ValidDate.asDate(d);
    } else if (d instanceof Date) {
      date = d;
    } else {
      date = newDate(d);
    }

    return isNaN(date.valueOf()) ? undefined : (date.valueOf() as Timestamp);
  }

  /** Get the current time as a `Timestamp`. */
  export function now(): Timestamp {
    return Date.now() as Timestamp;
  }

  //
  // Typeguards
  //

  /**
   * Typeguard for any number that maps to a valid `Date` when interpreted as
   * milliseconds since the UNIX epoch.
   */
  export function isTimestamp(t: unknown): t is Timestamp {
    return typeof t === "number" && !isNaN(timestamp(t));
  }

  /**
   * Typeguard for any number that maps to a valid `Date` when interpreted as
   * milliseconds since the UNIX epoch.
   */
  export const isType = isTimestamp;

  //
  // Conversions
  //

  /**
   * Parse a `Timestamp` into a `Date` object.
   */
  export function toDate(t: Timestamp): Date {
    return new Date(t);
  }

  /**
   * Parse a `Timestamp` into a `Date` object. The resulting date is guaranteed
   * to be valid, so we return a `ValidDate` type. In some cases it is
   * necessary to use `Timestamp.toDate` instead because `ValidDate`s are
   * read-only and can't be used when the mutable `Date` type is required.
   */
  export function toValidDate(t: Timestamp): ValidDate {
    return ValidDate.of(t);
  }

  /**
   * Convert a `Timestamp` into a `DateString`, a string encoding of the same
   * date value.
   */
  export function toDateString(t: Timestamp): DateString {
    return DateString.of(t);
  }

  /**
   * Get the Date-related fields encoded in a `Timestamp`, in the local
   * timezone.
   */
  export function localFields(d: Timestamp): LocalDateFields {
    return getLocalDateFields(toDate(d));
  }

  /**
   * Get the Date-related fields encoded in a `Timestamp`, in UTC.
   */
  export function utcFields(d: Timestamp): UTCDateFields {
    return getUTCDateFields(toDate(d));
  }

  /**
   * Assert that `t` is a `Timestamp`. If the assertion holds then return `t`
   * with an updated type. If the assertion fails throw an error.
   */
  export function coerceTimestamp(t: number): Timestamp {
    if (isTimestamp(t)) return t;
    throw new Error("Expected a timestamp for a valid Date object");
  }

  /**
   * Assert that `t` is a `Timestamp`. If the assertion holds then return `t`
   * with an updated type. If the assertion fails throw an error.
   */
  export const coerce = coerceTimestamp;

  //
  // Operations
  //

  /**
   * Take a function that expects a `Date` and returns a `Date`, and  apply it
   * to a `Timestamp`, returning a `Timestamp`.
   */
  export function map(
    t: Timestamp,
    fn: (d: Date) => Date | ValidDate,
  ): Timestamp;
  export function map(
    t: Timestamp,
    fn: (d: ValidDate) => Date | ValidDate,
  ): Timestamp;
  export function map(t: Timestamp, fn: (d: any) => any) {
    return timestamp(fn(toDate(t)));
  }
}
