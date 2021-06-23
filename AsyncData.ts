import * as Maybe from "./Maybe";
import * as Result from "./Result";
import { ErrorData, isErrorData, fromError } from "./ErrorData";

export {
  // Types
  AsyncData,
  T,
  // Constructors
  NotAsked,
  Loading,
  Success,
  Failure,
  FailureData,
  of,
  // Typeguards
  isNotAsked,
  isLoading,
  isSuccess,
  isFailure,
  isCompleted,
  // Conversions
  fromMaybe,
  fromResult,
  toMaybe,
  toResult,
  // Operations
  map,
  mapFailure,
  unwrap,
  caseOf,
  combine,
  encasePromise
};

//
// Types
//

/**
 * `AsyncData` models the lifecycle of async requests, where data starts
 * uninitialized, a request is made, and then either a successful or
 * unsuccessful response is received. These four stages correspond to the types
 * `NotAsked`, `Loading`, `Success`, and `Failure`. The `Success` type has data
 * of type `D`, while `Failure` can be any object which inherits from the
 * javascript `Error` object.
 */
type AsyncData<D, E extends Error> = NotAsked | Loading | D | E;

/** Alias for the `AsyncData` type. */
type T<D, E extends Error> = AsyncData<D, E>;

/**
 * The `NotAsked` variant of a `AsyncData` represents data that is not yet
 * initialized. Values of this type can be constructed with the `NotAsked`
 * constant.
 */
type NotAsked = typeof NotAsked;

/**
 * The `Loading` variant of a `AsyncData` represents data that is being
 * retrieved. Values of this type can be constructed with the `Loading`
 * constant.
 */
type Loading = typeof Loading;

/**
 * The `Success` variant of a `AsyncData` is an alias for retrieved data of
 * type `D`. The data can be of any concrete type that isn't an object
 * inheriting from `Error`, or the two constants `NotAsked` and `Loading`.
 */
type Success<D> = Exclude<D, NotAsked | Loading | Error>;

/**
 * The `Failure` variant of a `AsyncData` represents a situation where the data
 * could not be retrieved. It can be any error object which inherits from the
 * default JS `Error` built-in. Values of this type can be created like any
 * normal error object. The provided constructor `Failure` creates a vanilla
 * `Error` object, while `FailureData` creates an `ErrorData<D>` object which
 * inherits from `Error` but has an additional `data` field containing error
 * data of type `D`.
 */
type Failure<E extends Error> = E;

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<A, B, E extends Error> =
  | {
      NotAsked: () => B;
      Loading: () => B;
      Success: (a: A) => B;
      Failure: (e: E) => B;
    }
  | {
      NotAsked?: () => B;
      Loading?: () => B;
      Success?: (a: A) => B;
      Failure?: (e: E) => B;
      default: () => B;
    };

//
// Constructors
//

/** A constructor for the `NotAsked` variant of `AsyncData`. */
const NotAsked: unique symbol = Symbol("NotAsked");

/** A constructor for the `Loading` variant of `AsyncData`. */
const Loading: unique symbol = Symbol("Loading");

/** A constructor for the `Success` variant of `AsyncData`. */
const Success = <D>(d: Success<D>): Success<D> => d;

/**
 * A constructor for the `Failure` variant of `AsyncData`, creates a vanilla
 * `Error` object.
 */
const Failure = (message?: string): Failure<Error> => new Error(message);

/**
 * A constructor for the `Failure` variant of `AsyncData`, creates an
 * `ErrorData` object.
 */
const FailureData = <D>(errorData: D): Failure<ErrorData<D>> => new ErrorData(errorData);

/** Alias for the `Success` constructor. */
const of = Success;

//
// Typeguards
//

/** Typeguard for the `NotAsked` variant of a `AsyncData`. */
const isNotAsked = (x: unknown): x is NotAsked => x === NotAsked;

/** Typeguard for the `Loading` variant of a `AsyncData`. */
const isLoading = (x: unknown): x is Loading => x === Loading;

/** Typeguard for the `Failure` variant of a `AsyncData`. */
function isFailure<D, E extends Error>(x: AsyncData<D, E>): x is Failure<E>;
function isFailure<E extends Error = Error>(x: unknown): x is Failure<E>;
function isFailure(x: unknown) {
  return x instanceof Error;
}

/** Typeguard for the `Success` variant of a `AsyncData`. */
function isSuccess<D, E extends Error>(x: AsyncData<D, E>): x is Success<D>;
function isSuccess<D = unknown>(x: unknown): x is Success<D>;
function isSuccess(x: unknown) {
  return !isNotAsked(x) && !isLoading(x) && !isFailure(x);
}

/** Typeguard for the `Success` or `Failure` variants of a `AsyncData`. */
function isCompleted<D, E extends Error>(x: AsyncData<D, E>): x is Success<D> | Failure<E>;
function isCompleted<D = unknown, E extends Error = Error>(
  x: unknown
): x is Success<D> | Failure<E>;
function isCompleted(x: unknown) {
  return !isNotAsked(x) && !isLoading(x);
}

//
// Conversions
//

/**
 * Create an `AsyncData` from a `Maybe` by returning either a `NotAsked` or `Success`
 *
 *     Just<A> -> Success<A>
 *     Nothing -> NotAsked
 */
const fromMaybe = Maybe.toAsyncData;

/**
 * Create an `AsyncData` from a `Result`. Since the `Result` type is a subset
 * of `AsyncData` this is a lossless typecast.
 *
 *     Ok<V>  -> Success<V>
 *     Err<E> -> Failure<E>
 */
const fromResult = Result.toAsyncData;

/**
 * Create a `Maybe` from an `AsyncData` by mapping `Success` to
 * `Just` and everything else to `Nothing`.
 *
 *     NotAsked         -> Nothing
 *     Loading          -> Nothing
 *     Success<V>       -> Just<V>
 *     Err<E>           -> Nothing
 */
const toMaybe = <D, E extends Error>(x: AsyncData<D, E>): Maybe.T<Success<D>> =>
  isSuccess(x) ? x : Maybe.Nothing;

/**
 * Create a `Result` from an `AsyncData`, where the incomplete statuses map to
 * `Maybe.Nothing`.
 *
 *     NotAsked   -> Ok<Nothing>
 *     Loading    -> Ok<Nothing>
 *     Success<V> -> Ok<V>
 *     Failure<E> -> Err<E>
 */
const toResult = <D, E extends Error>(x: AsyncData<D, E>): Result.T<Maybe.T<D>, E> =>
  isCompleted(x) ? x : Maybe.Nothing;

//
// Operations
//

/** Apply `fn` if `a` is a `Success`. Otherwise return the non-success value. */
function map<A, B, E extends Error>(fn: (a: Success<A>) => B, a: E): E;
function map<A, B, E extends Error>(fn: (a: Success<A>) => B, a: NotAsked): NotAsked;
function map<A, B, E extends Error>(fn: (a: Success<A>) => B, a: Loading): Loading;
function map<A, B, E extends Error>(fn: (a: Success<A>) => B, a: Success<A>): B;
function map<A, B, E extends Error>(
  fn: (a: Success<A>) => Success<B>,
  a: AsyncData<Success<A>, E>
): AsyncData<Success<B>, E>;
function map<A, B, E extends Error>(
  fn: (a: Success<A>) => B,
  a: AsyncData<Success<A>, E>
): AsyncData<Success<B>, Extract<E | B, Error>>;
function map<A>(fn: (a: A) => any, a: AsyncData<A, Error>) {
  return isSuccess(a) ? fn(a) : a;
}

/**
 * Apply `fn` if `x` is a `Failure`. Note that in order to change the error
 * value, `fn` will either have to mutate the object, or create a new
 * object. Both options have pitfalls in different contexts.
 */
function mapFailure<A, B, E extends Error>(fn: (e: E) => B, a: Success<A>): Success<A>;
function mapFailure<A, B, E extends Error>(fn: (a: E) => B, a: NotAsked): NotAsked;
function mapFailure<A, B, E extends Error>(fn: (a: E) => B, a: Loading): Loading;
function mapFailure<A, B, E extends Error>(fn: (e: E) => B, a: E): B;
function mapFailure<A, B, E extends Error>(
  fn: (e: E) => Success<B>,
  a: AsyncData<Success<A>, E>
): Success<A | B>;
function mapFailure<A, B, EA extends Error, EB extends Error>(
  fn: (e: EA) => AsyncData<Success<B>, EB>,
  a: AsyncData<Success<A>, EA>
): AsyncData<Success<A | B>, EB>;
function mapFailure<A, B, E extends Error>(fn: (e: E) => B, a: AsyncData<A, E>) {
  return isFailure(a) ? fn(a) : a;
}

/**
 * Like a `case` in languages with pattern matching. Apply the appropriate function
 * depending on the data's status.
 */
const unwrap = <A, B, E extends Error>(
  notAskedFn: () => B,
  loadingFn: () => B,
  successFn: (a: A) => B,
  failureFn: (e: E) => B,
  x: AsyncData<A, E>
): B => {
  if (isSuccess(x)) {
    return successFn(x);
  } else if (isFailure(x)) {
    return failureFn(x);
  } else if (isNotAsked(x)) {
    return notAskedFn();
  } else {
    return loadingFn();
  }
};

/**
 * Simulates an ML style `case x of` pattern match, following the same logic as
 * `unwrap`.
 */
const caseOf = <A, B, E extends Error>(pattern: CaseOfPattern<A, B, E>, x: AsyncData<A, E>): B => {
  if (isNotAsked(x) && pattern["NotAsked"]) {
    return pattern["NotAsked"]();
  } else if (isLoading(x) && pattern["Loading"]) {
    return pattern["Loading"]();
  } else if (isSuccess(x) && pattern["Success"]) {
    return pattern["Success"](x);
  } else if (isFailure(x) && pattern["Failure"]) {
    return pattern["Failure"](x);
  } else {
    // if we reach this point then the default must exist
    return (pattern as any)["default"]();
  }
};

/**
 * If all values in the `xs` array are `Success`es then return the array. Otherwise
 * return the first non-success value.
 */
const combine = <A, E extends Error>(xs: ReadonlyArray<AsyncData<A, E>>): AsyncData<A[], E> => {
  const firstNonSuccess = xs.find((x) => !isSuccess(x)) as NotAsked | Loading | Failure<E>;
  const successVals = xs.filter<A>(isSuccess);
  return firstNonSuccess === undefined ? successVals : firstNonSuccess;
};

/**
 * Given a promise, return a promise which will always fulfill, catching
 * rejected values in a `Failure`.
 *
 *    fulfilled Promise<V> -> Promise<Success<V>>
 *    rejected Promise<V>  -> Promise<Failure<E>>
 */
const encasePromise = <V, E extends Error>(
  onReject: (e: unknown) => E,
  p: Promise<Success<V>>
): Promise<AsyncData<Success<V>, Failure<E>>> =>
  p.then((v: Success<V>) => Success(v)).catch((e: unknown) => onReject(e));
