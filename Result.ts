import * as Maybe from "./Maybe";
import * as AsyncData from "./AsyncData";
import { ErrorData, isErrorData } from "./ErrorData";

export {
  // Types
  Result,
  T,
  // Constructors
  Ok,
  Err,
  ErrData,
  of,
  // Typeguards
  isOk,
  isErr,
  // Conversions
  fromMaybe,
  fromAsyncData,
  toMaybe,
  toAsyncData,
  // Operations
  map,
  mapErr,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase,
  encasePromise
};

//
// Types
//

/**
 * A `Result` is either an `Ok` with data of type `V`, or an `Err` which
 * inherits from the javascript `Error` object.
 */
type Result<V, E extends Error> = V | E;

/** Alias for the `Result` type. */
type T<V, E extends Error> = Result<V, E>;

/**
 * The `Ok` variant of a `Result` is an alias for non-error values of type `V`.
 * The value can be of any concrete type that isn't an object inheriting from
 * `Error`.
 */
type Ok<V> = Exclude<V, Error>;

/**
 * The `Err` variant of a `Result` is any object which inherits from the default
 * JS `Error` built-in. Values of this type can be created like any normal
 * error object. The provided constructor `Err` creates a vanilla `Error` object,
 * while `ErrData` creates an `ErrorData<D>` object which inherits from `Error`
 * but has an additional `data` field containing error data of type `D`.
 */
type Err<E extends Error> = E;

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<V, E extends Error, R> =
  | {
      Ok: (a: Ok<V>) => R;
      Err: (e: E) => R;
    }
  | {
      Ok?: (a: Ok<V>) => R;
      Err?: (e: E) => R;
      default: () => R;
    };

//
// Constructors
//

/** A constructor for the `Ok` variant of `Result`. */
const Ok = <V>(v: Ok<V>): Ok<V> => v;

/**
 * A constructor for the `Err` variant of `Result`, creates a vanilla `Error`
 * object.
 */
const Err = (message?: string): Err<Error> => new Error(message);

/**
 * A constructor for the `Err` variant of `Result`, creates an `ErrorData`
 * object.
 */
const ErrData = <D>(errorData: D): Err<ErrorData<D>> => new ErrorData(errorData);

/** Alias for the `Ok` constructor. */
const of = Ok;

//
// Typeguards
//

/** Typeguard for the `Ok` variant of a `Result`. */
function isOk<V, E extends Error>(x: Result<V, E>): x is Ok<V>;
function isOk(x: unknown): x is Ok<unknown>;
function isOk(x: unknown) {
  return !(x instanceof Error);
}

/** Typeguard for the `Err` variant of a `Result`. */
function isErr<V, E extends Error>(x: Result<V, E>): x is Err<E>;
function isErr<E extends Error = Error>(x: unknown): x is Err<E>;
function isErr(x: unknown) {
  return x instanceof Error;
}

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

/**
 * Create a `Maybe` from a `Result` by replacing an `Err` with `Nothing`.
 *
 *     Ok<V>  -> Just<V>
 *     Err<E> -> Nothing
 */
const toMaybe = <V, E extends Error>(x: Result<V, E>): Maybe.T<Ok<V>> =>
  isOk(x) ? x : Maybe.Nothing;

/**
 * Create a `AsyncData` from a `Result`. Since the `Result` type is a subset
 * of `AsyncData` this is a lossless typecast.
 *
 *     Ok<V>  -> Success<V>
 *     Err<E> -> Failure<E>
 */
const toAsyncData = <V, E extends Error>(x: Result<V, E>): AsyncData.T<Ok<V>, Err<E>> =>
  x as AsyncData.T<Ok<V>, Err<E>>;

/** Apply `fn` if `a` is an `Ok`. Otherwise return the `Err`. */
function map<A, B, E extends Error>(fn: (a: Ok<A>) => B, a: E): E;
function map<A, B, E extends Error>(fn: (a: Ok<A>) => B, a: Ok<A>): B;
function map<A, B, E extends Error>(fn: (a: Ok<A>) => Ok<B>, a: Result<Ok<A>, E>): Result<Ok<B>, E>;
function map<A, B, E extends Error>(
  fn: (a: Ok<A>) => B,
  a: Result<Ok<A>, E>
): Result<Ok<B>, Extract<E | B, Error>>;
function map<A>(fn: (a: A) => any, a: Result<A, Error>) {
  return isOk(a) ? fn(a) : a;
}

/**
 * Apply `fn` if `x` is an `Err`. Note that in order to change the error
 * value, `fn` will either have to mutate the object, or create a new
 * object. Both options have pitfalls in different contexts.
 */
function mapErr<A, B, E extends Error>(fn: (e: E) => B, a: Ok<A>): Ok<A>;
function mapErr<A, B, E extends Error>(fn: (e: E) => B, a: E): B;
function mapErr<A, B, E extends Error>(fn: (e: E) => Ok<B>, a: Result<Ok<A>, E>): Ok<A | B>;
function mapErr<A, B, EA extends Error, EB extends Error>(
  fn: (e: EA) => Result<Ok<B>, EB>,
  a: Result<Ok<A>, EA>
): Result<Ok<A | B>, EB>;
function mapErr<A, B, E extends Error>(fn: (e: E) => B, a: Result<A, E>) {
  return isErr(a) ? fn(a) : a;
}

/**
 * Provide a default which is used if `x` is an `Err`.
 */
function withDefault<V, DE extends Error>(defaultVal: Err<DE>, x: Result<V, Error>): Result<V, DE>;
function withDefault<V, DV>(defaultVal: Ok<DV>, x: Ok<V>): Ok<V>;
function withDefault<V, DV>(defaultVal: Ok<DV>, x: Result<V, Error>): Ok<V | DV>;
function withDefault<V, DV, DE extends Error>(
  defaultVal: Result<DV, DE>,
  x: Result<V, Error>
): Result<V | DV, DE>;
function withDefault(defaultVal: unknown, x: unknown) {
  return isOk(x) ? x : defaultVal;
}

/**
 * Like a `case` in languages with pattern matching. Apply the `okFn` to an
 * `Ok` value and `errFn` to an `Err`.
 */
const unwrap = <A, B, E extends Error>(
  okFn: (a: Ok<A>) => B,
  errFn: (e: E) => B,
  x: Result<A, E>
): B => (isErr(x) ? errFn(x) : okFn(x as Ok<A>));

/**
 * Simulates an ML style `case x of` pattern match, following the same
 * logic as `unwrap`.
 */
const caseOf = <A, E extends Error, R>(pattern: CaseOfPattern<A, E, R>, x: Result<A, E>): R => {
  if (isOk(x) && pattern["Ok"]) {
    return pattern["Ok"](x);
  } else if (isErr(x) && pattern["Err"]) {
    return pattern["Err"](x);
  } else {
    return (pattern as any)["default"]();
  }
};

/**
 * If all values in the `xs` array are `Ok`s then return the array. If
 * any value is an `Err` then return the first error value.
 */
const combine = <A, E extends Error>(xs: ReadonlyArray<Result<A, E>>): Result<Array<A>, E> => {
  const firstErr = xs.find(isErr) as E | undefined;
  const okVals = xs.filter<A>(isOk);
  return firstErr === undefined ? okVals : firstErr;
};

/**
 * Create a version of a function which returns a `Result` instead of
 * throwing an error.
 */
const encase = <Args extends Array<any>, V, E extends Error>(
  onThrow: (e: unknown) => E,
  fn: (...args: Args) => V
): ((...args: Args) => Result<V, E>) => {
  return (...args: Args): Result<V, E> => {
    try {
      return fn(...args);
    } catch (e: unknown) {
      return onThrow(e);
    }
  };
};

/**
 * Given a promise, return a promise which will always fulfill, catching
 * rejected values in an `Err`.
 *
 *    fulfilled Promise<V> -> Promise<Ok<V>>
 *    rejected Promise<V>  -> Promise<Err>
 */
const encasePromise = <V, E extends Error>(
  onReject: (e: unknown) => E,
  p: Promise<Ok<V>>
): Promise<Result<Ok<V>, Err<E>>> => p.then((v: Ok<V>) => Ok(v)).catch((e: unknown) => onReject(e));
