export {
  // Types
  ErrorData,
  T,
  // Constructors
  errorData,
  of,
  // Typeguards
  isErrorData,
  // Conversions
  fromError,
  // Operations
  map
};

//
// Types (and constructor)
//

/**
 * The `ErrorData` class extends the built in JS `Error` class. This means
 * that `ErrorData`s have the same behavior as `Error`s when thrown. We add a
 * `data` field to hold the details associated with the error.
 */
class ErrorData<D> extends Error {
  data: D;
  constructor(data: D, message?: string) {
    super();
    Object.setPrototypeOf(this, ErrorData.prototype);
    this.name = "ErrorData";
    this.message = message ?? "This Error contains details in the 'data' field";
    this.data = data;
  }
}

/** Alias for the `ErrorData` type */
type T<D> = ErrorData<D>;

//
// Constructos
//

/** A constructor for the `ErrorData` object. */
const errorData = <D>(data: D, message?: string): ErrorData<D> => new ErrorData(data, message);

/** Alias for the `errorData` constructor. */
const of = errorData;

//
// Typeguards
//

/** Typeguard for objects which are instances of `ErrorData`. */
const isErrorData = <D = unknown>(x: unknown): x is ErrorData<D> => x instanceof ErrorData;

//
// Conversions
//

/** Convert any `Error` into an `ErrorData`, using `fn` to create the data. */
function fromError<D>(e: Error, fn: (e: Error) => D): ErrorData<D> {
  return new ErrorData(fn(e), e.message);
}

//
// Operations
//

/** Copy an `ErrorData` object and apply `fn` to the `data` field. */
const map = <A, B>(e: ErrorData<A>, fn: (data: A) => B): ErrorData<B> =>
  new ErrorData(fn(e.data), e.message);
