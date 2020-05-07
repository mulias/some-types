import * as Maybe from "./Maybe";
import * as AsyncData from "./AsyncData";
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
  fromAsyncData,
  fromErrorable,
  fromPromise,
  toMaybe,
  toAsyncData,
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
 * A `Result` is either an `Ok` with data of type `V`, or an `Err` object
 * containing an error value of type `E`.
 */
type Result<V, E> = Ok<V> | Err<E>;

/** Alias for the `Result` type. */
type T<V, E> = Result<V, E>;

/**
 * The `Ok` variant of a `Result` is an alias for non-error values of type
 * `V`. Values of this type can be constructed with the `Ok` function.
 */
type Ok<V> = V;

/** 
 * The `Err` variant of a `Result` is an object which inherits from the default
 * JS `Error` built-in, and contains some error value of type `E`. Values of
 * this type can be constructed with the `Err` function.

 */
type Err<E> = ErrorValue<E>;

/* Create a wrapped type where each member of `T` is a `Result` with error
 * value `E`.
 */
type ResultMapped<T, E> = { [k in keyof T]: Result<T[k], E> };

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<A, B, E> =
  | {
      Ok: (a: A) => B;
      Err: (e: Err<E>) => B;
    }
  | {
      Ok?: (a: A) => B;
      Err?: (e: Err<E>) => B;
      default: () => B;
    };
//
// Constructors
//

/**
 * A constructor for the `Ok` variant of `Result`, which is effectively the
 * identity function.
 */
const Ok = <V>(v: V): Ok<V> => v;

/** A constructor for the `Err` variant of `Result`. */
const Err = <E>(e: E): Err<E> => new ErrorValue(e);

//
// Typeguards
//

/** Typeguard for the `Ok` variant of a `Result`. */
const isOk = <V, E>(x: Result<V, E>): x is V => !(x instanceof ErrorValue);

/** Typeguard for the `Err` variant of a `Result`. */
const isErr = <V, E>(x: Result<V, E>): x is Err<E> => x instanceof ErrorValue;

//
// Conversions
//

/**
 * Create a `Result` from a `Maybe` by providing the `Err` to use in place of a `Nothing`.
 *
 *     Just<A> -> Ok<A>
 *     Nothing -> Err<E>
 */
const fromMaybe = Maybe.toResult;

/**
 * Create a `Result` from a `AsyncData`, where the incomplete statuses map to
 * `Maybe.Nothing`.
 *
 *     NotAsked   -> Ok<Nothing>
 *     Loading    -> Ok<Nothing>
 *     Success<V> -> Ok<V>
 *     Failure<E> -> Err<E>
 */
const fromAsyncData = AsyncData.toResult;

/** Create a `Result` from any value that might be a JS `Error` object. */
function fromErrorable<V, E>(x: Result<V, E>): Result<Exclude<V, Error>, E>;
function fromErrorable<V>(x: V | Error): Result<Exclude<V, Error>, string>;
function fromErrorable(x: any) {
  return x instanceof Error ? fromError(x) : x;
}

/**
 * Given a promise, return a promise which will always fulfill, catching
 * rejected values in an `Err`.
 *
 *    fulfilled Promise<D> -> Promise<Ok<V>>
 *    rejected Promise<D>  -> Promise<Err<unknown>>
 */
const fromPromise = <V, E = unknown>(p: Promise<V>): Promise<Result<V, E>> =>
  p.then((v: V) => Ok(v)).catch((e: E) => Err(e));

/**
 * Create a `Maybe` from a `Result` by replacing an `Err` with `Nothing`.
 *
 *     Ok<V>  -> Just<V>
 *     Err<E> -> Nothing
 */
const toMaybe = <V, E>(x: Result<V, E>): Maybe.T<V> => (isOk(x) ? x : Maybe.Nothing);

/**
 * Create a `AsyncData` from a `Result`. Since the `Result` type is a subset
 * of `AsyncData` this is a lossless typecast.
 *
 *     Ok<V>  -> Success<V>
 *     Err<E> -> Failure<E>
 */
const toAsyncData = <V, E>(x: Result<V, E>): AsyncData.T<V, E> => x as AsyncData.T<V, E>;

/** Apply `fn` if all of `resultArgs` are `Ok`s. Otherwise return the first `Err`. */
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
const caseOf = <A, B, E>(pattern: CaseOfPattern<A, B, E>, x: Result<A, E>): B => {
  if (isOk(x) && pattern["Ok"]) {
    return pattern["Ok"](x);
  } else if (isErr(x) && pattern["Err"]) {
    return pattern["Err"](x);
  } else {
    return (pattern as any)["default"]();
  }
};

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
