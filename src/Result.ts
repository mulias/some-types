import * as Maybe from "./Maybe";
import * as RemoteData from "./RemoteData";
import { ErrorValue, isErrorValue, fromError } from "./ErrorValue";

export {
  // Types
  Result,
  T,
  // Constructors
  Ok,
  Err,
  // Typeguards
  isOk,
  isErr,
  // Conversions
  fromMaybe,
  fromRemoteData,
  fromErrorable,
  fromPromise,
  toMaybe,
  toRemoteData,
  // Operations
  map,
  mapErr,
  mapBoth,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase
};

//
// Types
//

/**
 * A `Result` is either an `Ok` containing data of type `V`, or an `Err` object
 * containing an error value of type `E`.
 */
type Result<V, E> = Ok<V> | Err<E>;

/** Alias for the `Result` type. */
type T<V, E> = Result<V, E>;

type Ok<V> = V;

type Err<E> = ErrorValue<E>;

/**
 * Create a wrapped type where each member of `T` is a `Result` with error
 * value `E`.
 */
type ResultMapped<T, E> = { [k in keyof T]: Result<T[k], E> };

//
// Constructors
//

/**
 * A constructor for the `Ok` variant of `Result`, which is effectively the
 * identity function.
 */
const Ok = <V, E>(v: V): Ok<V> => v;

/** A constructor for the `Err` variant of `Result`. */
const Err = <V, E>(e: E): Err<E> => new ErrorValue(e);

//
// Typeguards
//

/** Returns true and narrows type if `x` is not an `Err`. */
const isOk = <V, E>(x: Result<V, E>): x is V => !(x instanceof ErrorValue);

/** Returns true and narrows type if `x` is an `Err`. */
const isErr = <V, E>(x: Result<V, E>): x is Err<E> => x instanceof ErrorValue;

//
// Conversions
//

/** Create a `Result` from a `Maybe` by providing the `Err` to use in place of a `Nothing. */
const fromMaybe = Maybe.toResult;

/** TODO */
const fromRemoteData = RemoteData.toResult;

/**
 * TODO
 * Coerce an `Error` object into an `Err` object by ensuring that the object
 * has a `value` field that is either a string or undefined. If the input is an
 * `Error` that does not have a `value` field, then copy the `message` property
 * to `value`. This conversion might mutate the input. The mutation is only
 * destructive in the case where the `Error` already has a `value` field which
 * contains a value with a `typeof` which is _not_ string or undefined.
 */
function fromErrorable<V, E>(x: Result<V, E>): Result<Exclude<V, Error>, E>;
function fromErrorable<V>(x: V | Error): Result<Exclude<V, Error>, string>;
function fromErrorable(x: any) {
  return x instanceof Error ? fromError(x) : x;
}

/** TODO */
const fromPromise = <V, E = unknown>(p: Promise<V>): Promise<Result<V, E>> =>
  p.then((v: V) => Ok(v)).catch((e: E) => Err(e));

/** Create a `Maybe` from a `Result` by dropping the `Err` value for a `Nothing. */
const toMaybe = <V, E>(x: Result<V, E>): Maybe.T<V> => (isOk(x) ? x : Maybe.Nothing);

/** TODO */
const toRemoteData = <V, E>(x: Result<V, E>): RemoteData.T<V, E> => x as RemoteData.T<V, E>;

/** Apply `fn` if none of `resultArgs` are `Err`s. Otherwise return the first `Err`. */
const map = <Args extends Array<any>, R, E>(
  fn: (...args: Args) => Result<R, E>,
  ...resultArgs: ResultMapped<Args, E>
): Result<R, E> => {
  const firstErr = resultArgs.find(isErr) as Err<E> | undefined;
  const okVals = resultArgs.filter(isOk);
  return firstErr === undefined ? fn(...(okVals as Args)) : firstErr;
};

/**
 * Apply `fn` if `x` is an `Err`. Note that in order to change the error
 * value, `fn` will either have to mutate the object, or create a new
 * object. Both options have pitfalls in different contexts.
 */
const mapErr = <V, A, B>(fn: (e: Err<A>) => Result<V, B>, x: Result<V, A>): Result<V, B> =>
  isErr(x) ? fn(x) : x;

/**
 * Either apply `okFn` to all `resultArgs` if they are all `Ok`, or apply
 * `errFn` to the first `Err` value.
 */
const mapBoth = <Args extends Array<any>, R, E, F>(
  okFn: (...args: Args) => Result<R, F>,
  errFn: (e: Err<E>) => Result<R, F>,
  ...resultArgs: ResultMapped<Args, E>
): Result<R, F> => {
  const firstErr = resultArgs.find(isErr) as Err<E> | undefined;
  const okVals = resultArgs.filter(isOk);
  return firstErr === undefined ? okFn(...(okVals as Args)) : errFn(firstErr);
};

/**
 * Provide a default which is used if `x` is an `Err`.
 */
const withDefault = <V, E>(defaultVal: V, x: Result<V, E>): V => (isOk(x) ? x : defaultVal);

/**
 * Like a `case` in languages with pattern matching. Apply the `okFn` to an
 * `Ok` value and `errFn` to an `Err`.
 */
const unwrap = <A, B, E>(okFn: (a: A) => B, errFn: (e: Err<E>) => B, x: Result<A, E>): B =>
  isOk(x) ? okFn(x) : errFn(x);

/**
 * Simulates an ML style `case x of` pattern match, following the same
 * logic as `unwrap`.
 */
const caseOf = <A, B, E>(pattern: { Ok: (a: A) => B; Err: (e: Err<E>) => B }, x: Result<A, E>): B =>
  isOk(x) ? pattern["Ok"](x) : pattern["Err"](x);

/**
 * If all values in the `xs` array are not `Err`s then return the array. If
 * any value is an `Err` then return the first error value.
 */
const combine = <A, E>(xs: ReadonlyArray<Result<A, E>>): Result<Array<A>, E> => {
  const firstErr = xs.find(isErr);
  const okVals = xs.filter(isOk);
  return firstErr === undefined ? okVals : firstErr;
};

/**
 * Create a version of a function which returns a `Result` instead of
 * throwing an error.
 */
const encase = <Args extends Array<any>, V>(
  throwsFn: (...args: Args) => V
): ((...args: Args) => Result<V, unknown>) => {
  return (...args: Args): Result<V, unknown> => {
    try {
      return throwsFn(...args);
    } catch (e) {
      if (e instanceof ErrorValue) {
        return e;
      } else if (e instanceof Error) {
        return fromErrorable(e);
      } else {
        return new ErrorValue(e);
      }
    }
  };
};
