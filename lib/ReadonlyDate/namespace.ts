import { OmitStrict } from "../type_util";

/**
 *
 * Type: Similar to `ReadonlyArray`, `ReadonlyDate` is a `Date` object where
 * all mutable methods have been removed from the type declaration. This type
 * helps to communicate that a date object should not be mutated.
 *
 */
export type ReadonlyDate = Readonly<
  OmitStrict<
    Date,
    | "setTime"
    | "setMilliseconds"
    | "setUTCMilliseconds"
    | "setSeconds"
    | "setUTCSeconds"
    | "setMinutes"
    | "setUTCMinutes"
    | "setHours"
    | "setUTCHours"
    | "setDate"
    | "setUTCDate"
    | "setMonth"
    | "setUTCMonth"
    | "setFullYear"
    | "setUTCFullYear"
  >
>;

/**
 *
 * Namespace: The `ReadonlyDate` namespace contains functions for
 * `ReadonlyDate` values including constructors and conversions to other data
 * types.
 *
 */
export namespace ReadonlyDate {
  //
  // Constructors
  //

  /**
   * Create a new `ReadonlyDate` object by parsing a value `d` that might
   * represent a date.
   */
  export function readonlyDate(d: string | number | Date): ReadonlyDate {
    return new Date(d) as ReadonlyDate;
  }

  /** Alias for the `readonlyDate` constructor. */
  export const of = readonlyDate;

  /** Return the current date/time as a `ReadonlyDate`. */
  export function now(): ReadonlyDate {
    return new Date() as ReadonlyDate;
  }

  //
  // Conversions
  //

  /** Crate a new `ReadonlyDate` from an existing `Date`. */
  export function fromDate(d: Date): ReadonlyDate {
    return readonlyDate(d);
  }

  /**
   * Create a new `Date` from an existing `ReadonlyDate` object `d`. Returning a
   * new object means that `d` can still be used without fear of mutation.
   *
   * If you want to instead use a `ReadonlyDate` in a context that requires a
   * `Date` and are ok with potential mutation you can cast to the more
   * permissive type with `d as Date` or with the `asDate` function. One example
   * of a situation where this is useful is the `date-fns` library. This library
   * takes care to avoid mutation by copying dates internally, but it uses `Date`
   * in its typescript types. This means that `ReadonlyDate` can't be used
   * directly, but casting to a `Date` should be safe.
   */
  export function toDate(d: ReadonlyDate): Date {
    return new Date(d as Date);
  }

  /**
   * Cast `d` to the `Date` type.
   */
  export function asDate(d: ReadonlyDate): Date {
    return d as Date;
  }
}
