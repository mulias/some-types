export {
  // Types
  DataError,
  T,
  // Constructors
  dataError,
  of,
  // Typeguards
  isDataError,
  // Conversions
  fromError,
  // Operations
  map
};

//
// Types
//

/**
 * The `DataError` class extends the built in JS `Error` class. This means
 * that `DataError`s have the same behavior as `Error`s when thrown. We add a
 * `data` field to hold the details associated with the error.
 */
class DataError<D> extends Error {
  data: D;
  constructor(data: D, message?: string) {
    super();
    Object.setPrototypeOf(this, DataError.prototype);
    this.name = "DataError";
    this.message = message ?? "This Error contains details in the 'data' field";
    this.data = data;
  }
}

/** Alias for the `DataError` type */
type T<D> = DataError<D>;

//
// Constructos
//

/** A constructor for the `DataError` object. */
function dataError<D>(data: D, message?: string): DataError<D> {
  return new DataError(data, message);
}

/** Alias for the `dataError` constructor. */
const of = dataError;

//
// Typeguards
//

/** Typeguard for objects which are instances of `DataError`. */
function isDataError<D = unknown>(x: unknown): x is DataError<D> {
  return x instanceof DataError;
}

//
// Conversions
//

/** Convert any `Error` into a `DataError`, using `fn` to create the data. */
function fromError<D>(e: Error, fn: (e: Error) => D, message?: string): DataError<D> {
  return new DataError(fn(e), message);
}

//
// Operations
//

/** Copy a `DataError` object and apply `fn` to the `data` field. */
function map<A, B>(e: DataError<A>, fn: (data: A) => B): DataError<B> {
  return new DataError(fn(e.data), e.message);
}
