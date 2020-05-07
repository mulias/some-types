import * as Maybe from "./Maybe";
import * as DateString from "./DateString";

export {
  // Types
  ValidDate,
  T,
  // Constructors
  now,
  // Typeguards
  isValidDate,
  // Conversions
  fromDate,
  parse,
  // Operations
  map
};

//
// Types
//

/** A `Date` object which we know is not an `Invalid Date`. */
type ValidDate = Date & IsValidDate;
enum IsValidDate {
  _ = "VALID_DATE"
}

/** Alias for the `ValidDate` type */
type T = ValidDate;

//
// Constructors
//

/** Get the current time, which we know is a `ValidDate`. */
const now = (): ValidDate => new Date() as ValidDate;

//
// Typeguards
//

/** Typeguard for `Date` objects that are valid dates. */
const isValidDate = (d: unknown): d is ValidDate => d instanceof Date && !isNaN(d.getTime());

//
// Conversion
//

/**
 * Return `d` as a `ValidDate` if it's valid, otherwise return
 * `Maybe.Nothing`.
 */
function fromDate(d: ValidDate): ValidDate;
function fromDate(d: Date): Maybe.T<ValidDate>;
function fromDate(d: Date) {
  return isValidDate(d) ? d : undefined;
}

/**
 * Attempt to parse some value into a `Date` object. If the result is
 * valid, return a `ValidDate`, otherwise return `Maybe.Nothing`.
 */
function parse<A extends DateString.T | ValidDate>(a: A): ValidDate;
function parse<A extends Date | number | string>(a: A): Maybe.T<ValidDate>;
function parse(a: any) {
  return fromDate(new Date(a));
}

//
// Operations
//

/**
 * Apply a `Date` object operation onto one or more `ValidDate`s. If `fn`
 * produces an invalid `Date`, return `Maybe.Nothing`.
 */
function map<Args extends Array<ValidDate>>(
  fn: (...args: Args) => ValidDate,
  ...validDateArgs: Args
): ValidDate;
function map<Args extends Array<ValidDate>>(
  fn: (...args: Args) => Date,
  ...validDateArgs: Args
): Maybe.T<ValidDate>;
function map<Args extends Array<ValidDate>>(fn: (...args: Args) => any, ...validDateArgs: Args) {
  return fromDate(fn(...validDateArgs));
}
