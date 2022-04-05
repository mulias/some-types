import * as Maybe from "./Maybe";
import * as DateString from "./DateString";

export {
  // Types
  ValidDate,
  T,
  // Constructors
  // ValidDate,
  of,
  now,
  // Typeguards
  isValidDate,
  // Conversions
  fromDate,
  // Operations
  map,
  mapUnsafe
};

//
// Types
//

/** A `Date` object which we know is not an `Invalid Date`. */
type ValidDate = Date & { readonly __opaque__: IsValidDate };
enum IsValidDate {}

/** Alias for the `ValidDate` type */
type T = ValidDate;

//
// Constructors
//

/**
 * Attempt to parse some value into a new `Date` object. If the result is
 * valid, return a `ValidDate`, otherwise return `Maybe.Nothing`.
 */
function ValidDate<D extends DateString.T | ValidDate>(d: D): ValidDate;
function ValidDate(value: string | number | Date): Maybe.T<ValidDate>;
function ValidDate(a: DateString.T | ValidDate | string | number | Date) {
  return fromDate(new Date(a));
}

/** Alias for the `ValidDate` constructor. */
const of = ValidDate;

/** Get the current time, which we know is a `ValidDate`. */
const now = () => new Date() as ValidDate;

//
// Typeguards
//

/** Typeguard for `Date` objects that are valid dates. */
const isValidDate = (d: unknown): d is ValidDate => d instanceof Date && !isNaN(d.getTime());

//
// Conversion
//

/**
 * Return `d` as a `ValidDate` if it's valid, otherwise return `Maybe.Nothing`.
 * Unlike the `ValidDate` constructor this does not create a new object.
 */
function fromDate(d: ValidDate): ValidDate;
function fromDate(d: Date): Maybe.T<ValidDate>;
function fromDate(d: Date) {
  return Maybe.fromPredicate(d, isValidDate);
}

//
// Operations
//

/**
 * Apply a `Date` object operation onto a `ValidDate`. If `fn` produces an
 * invalid `Date`, return `Maybe.Nothing`.
 */
function map(validDate: ValidDate, fn: (d: Date) => ValidDate): ValidDate;
function map(validDate: ValidDate, fn: (d: Date) => Date): Maybe.T<ValidDate>;
function map(validDate: ValidDate, fn: (d: Date) => Date): Maybe.T<ValidDate> {
  return fromDate(fn(validDate));
}

/**
 * Apply a `Date` object operation onto a `ValidDate`, casting the result as a
 * `ValidDate`. In many cases we can be confident that a date operation will
 * succeed if the input is a valid date, so it's expedient to circumvent the
 * more conservative return type of `map`.
 */
function mapUnsafe(validDate: ValidDate, fn: (d: Date) => Date): ValidDate {
  return map(validDate, fn) as ValidDate;
}
