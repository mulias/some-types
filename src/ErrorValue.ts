export {
  // Types (and constructor)
  ErrorValue,
  T,
  // Typeguards
  isErrorValue,
  // Conversions
  fromError
};

//
// Types (and constructor)
//

/**
 * The `ErrorValue` class extends the built in JS `Error` class. This means
 * that `ErrorValue`s have the same behavior as `Error`s when thrown. We add a
 * `value` field to hold the data associated with the error.
 */
class ErrorValue<E> extends Error {
  value: E;
  constructor(value: E) {
    super();
    Object.setPrototypeOf(this, ErrorValue.prototype);
    this.name = "ErrorValue";
    this.message = "This Error contains data in the 'value' field";
    this.value = value;
  }
}

/** Alias for the `ErrorValue` type */
type T<E> = ErrorValue<E>;

//
// Typeguards
//

/** Typeguard for objects which are instances of `ErrorValue`. */
const isErrorValue = <E>(x: unknown): x is ErrorValue<E> => x instanceof ErrorValue;

//
// Conversions
//

/**
 * Convert any `Error` into an `ErrorValue`. If `e` is already an `ErrorValue`
 * then return it unchanged. Otherwise create a new `ErrorValue` with the error
 * message as the value.
 */
function fromError<E>(e: ErrorValue<E>): ErrorValue<E>;
function fromError(e: Error): ErrorValue<string>;
function fromError(e: Error) {
  return !(e instanceof ErrorValue) ? new ErrorValue(e.message) : e;
}
