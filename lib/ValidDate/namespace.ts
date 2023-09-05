import { Branded } from "../Branded/namespace";
import { Option } from "../Option/namespace";
import { ReadonlyDate } from "../ReadonlyDate/namespace";
import { NewDateArgs, newDate } from "../util/date";

/**
 *
 * Type: A `ValidDate` is a `Date` object which we know is not invalid.
 *
 * A quirk of JavaScript `Date`s is that if a date is constructed with invalid
 * inputs then the internal representation will be `NaN`. The `ValidDate` type
 * indicates that the date has been checked and is known to be valid.
 *
 * One downside of this type is that in order to ensure the date stays valid it
 * is a `ReadonlyDate`, which does not have access to the mutable fields of the
 * `Date` type. Similar to how a `ReadonlyArray` can't be used in places where
 * an `Array` is required, `ReadonlyDate` can't be used when a `Date` is
 * required. To get around this limitation the `ValidDate` must be explicitly
 * cast to a `Date`, breaking the read-only guarantee.
 *
 */
export type ValidDate = Branded<ReadonlyDate, typeof ValidDateBrand>;

declare const ValidDateBrand: unique symbol;

/**
 *
 * Namespace: The `ValidDate` namespace contains functions for `ValidDate`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace ValidDate {
  //
  // Constructors
  //

  /**
   * Create a `ValidDate` from a value that encodes a date. If the value can't
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
   * valid date use `ValidDate.parse` instead.
   */
  export function validDate(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): ValidDate {
    const date = parse(d);
    if (date !== undefined) {
      return date;
    } else {
      throw new RangeError("Value must encode a valid date");
    }
  }

  /**
   * Create a `ValidDate` from a value that encodes a date. If the value can't
   * be interpreted as a valid date then throw an error.
   *
   * This function is useful for cases where there is high confidence that the
   * input encodes a valid date. For cases where the input might not encode a
   * valid date use `ValidDate.parse` instead.
   */
  export const of = validDate;

  /**
   * Create a `ValidDate` from a value that might encode a date. If the value
   * can't be interpreted as a valid date then return `undefined`.
   *
   * This function is useful for cases where the input might not be a valid
   * date. If the input should be valid in all but the most exceptional of
   * cases then use `DateString.dateString` or `Datestring.of` instead.
   */
  export function parse(
    d: string | number | Date | ValidDate | NewDateArgs,
  ): Option<ValidDate> {
    return fromDate(newDate(d as any));
  }

  /** Get the current time, which we know is a `ValidDate`. */
  export function now(): ValidDate {
    return new Date() as ReadonlyDate as ValidDate;
  }

  //
  // Typeguards
  //

  /** Typeguard for `Date` objects that are valid dates. */
  export function isValidDate(d: unknown): d is ValidDate {
    return d instanceof Date && !isNaN(d.getTime());
  }

  /** Typeguard for `Date` objects that are valid dates. */
  export const isType = isValidDate;

  //
  // Conversion
  //

  /**
   * Return `d` as a `ValidDate` if it's valid, otherwise return `undefined`.
   * Unlike the `ValidDate` constructor this does not create a new object.
   */
  export function fromDate(d: ValidDate): ValidDate;
  export function fromDate(d: Date): Option<ValidDate>;
  export function fromDate(d: ValidDate | Date) {
    return isValidDate(d) ? d : undefined;
  }

  /**
   * Create a new `Date` from an existing `ValidDate` object `d`. Returning a
   * new object means that `d` can still be used without fear of mutation.
   *
   * If you want to instead use a `ValidDate` in a context that requires a `Date`
   * and are ok with potential mutation you can cast to the more permissive type
   * with `d as ReadonlyDate as Date` or with the `asDate` export function. One example
   * of a situation where this is useful is the `date-fns` library. This library
   * takes care to avoid mutation by copying dates internally, but it uses `Date`
   * in its typescript types. This means that `ValidDate` can't be used directly,
   * but casting to a `Date` should be safe.
   */
  export function toDate(d: ValidDate): Date {
    return new Date(d as ReadonlyDate as Date);
  }

  /**
   * Cast `d` to the `Date` type. Since `ValidDate` is both a readonly and
   * branded type two casts are required to go from a ``ValidDate` to a `Date`.
   * This function is a more concise alternative to `d as ReadonlyDate as Date`.
   */
  export function asDate(d: ValidDate): Date {
    return d as ReadonlyDate as Date;
  }

  /**
   * Assert that `d` is a `ValidDate`.  If the assertion holds then return `d`
   * with an updated type. If the assertion fails throw an error.
   */
  export function coerceValidDate(d: Date): ValidDate {
    if (isValidDate(d)) return d;
    throw new Error("Expected a valid Date object.");
  }

  /**
   * Assert that `d` is a `ValidDate`.  If the assertion holds then return `d`
   * with an updated type. If the assertion fails throw an error.
   */
  export const coerce = coerceValidDate;

  //
  // Operations
  //

  /**
   * Apply a `Date` object operation onto a `ValidDate`. If `fn` produces an
   * invalid `Date`, return `undefined`.
   */
  export function map(vd: ValidDate, fn: (d: Date) => ValidDate): ValidDate;
  export function map(vd: ValidDate, fn: (d: Date) => Date): Option<ValidDate>;
  export function map(vd: ValidDate, fn: (d: Date) => ValidDate | Date) {
    return fromDate(fn(vd as any) as any);
  }
}
