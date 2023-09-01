/**
 *
 * Type: A `DataError<D>` is an instance of the `DataError` class which inherits
 * from `Error` but additionally has a parametrized `data` field which can
 * store a value of type `D`. When thrown `DataError` has the same behavior as
 * `Error`.
 *
 * The `Result` and `RemoteData` modules may use `DataError` to track arbitrary
 * data on `Result.Err` or `RemoteData.Failure`.
 *
 */
export class DataError<D> extends Error {
  data: D;
  constructor(data: D, message?: string) {
    super(message);
    Object.setPrototypeOf(this, DataError.prototype);
    this.name = "DataError";
    this.message = message ?? "This Error contains details in the 'data' field";
    this.data = data;
  }
}

/**
 *
 * Namespace: The `DataError` namespace contains functions for `DataError`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace DataError {
  //
  // Constructors
  //

  /** A constructor for the `DataError` object. */
  export function dataError<D>(data: D, message?: string): DataError<D> {
    return new DataError(data, message);
  }

  /** Alias for the `dataError` constructor. */
  export const of = dataError;

  //
  // Typeguards
  //

  /** Typeguard for objects which are instances of `DataError`. */
  export function isDataError<D = unknown>(x: unknown): x is DataError<D> {
    return x instanceof DataError;
  }

  /** Typeguard for objects which are instances of `DataError`. */
  export const isType = isDataError;

  //
  // Conversions
  //

  /** Create a `DataError` from an `Error` object. */
  export function fromError<D>(e: Error, data: D): DataError<D> {
    const de = new DataError(data);
    de.message = e.message;
    de.stack = e.stack;
    de.name = e.name;
    return de;
  }

  //
  // Operations
  //

  /** Copy a `DataError` object and apply `fn` to the `data` field. */
  export function map<A, B>(e: DataError<A>, fn: (data: A) => B): DataError<B> {
    return fromError(e, fn(e.data));
  }
}
