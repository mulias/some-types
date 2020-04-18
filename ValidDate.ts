import * as Maybe from "./Maybe";
import { DateString } from "./DateString";

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

/** TODO */
type ValidDate = Date & IsValidDate;
enum IsValidDate {
  _ = "VALID_DATE"
}

/** TODO */
type T = ValidDate;

// Functions that convert to a DateString return a `Maybe` if the input might be a Date, but
// always succeed if the input is a different DateString.
type ValidDateConversion<In> = In extends DateString | ValidDate ? ValidDate : Maybe.T<ValidDate>;

//
// Constructors
//

/** TODO */
const now = (): ValidDate => new Date() as ValidDate;

//
// Typeguards
//

/** Typeguard for Date objects that are valid dates. */
const isValidDate = (d: unknown): d is ValidDate => d instanceof Date && !isNaN(d.getTime());

//
// Conversion
//

/** TODO */
const fromDate = (d: Date): Maybe.T<ValidDate> => (isValidDate(d) ? d : undefined);

/** TODO */
const parse = <A extends number | string | DateString>(a: A): ValidDateConversion<A> =>
  fromDate(new Date(a)) as ValidDateConversion<A>;

//
// Operations
//

/** TODO */
const map = <D extends Date | ValidDate>(
  fn: (d: ValidDate) => Date,
  d: ValidDate
): Maybe.T<ValidDate> => fromDate(fn(d));
