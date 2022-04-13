import * as Maybe from "./Maybe";
import * as Result from "./Result";
import * as DataError from "./DataError";

export {
  // Types
  RemoteData,
  NotAsked,
  Loading,
  Success,
  Failure,
  T,
  // Constructors
  notAsked,
  loading,
  success,
  failure,
  failureData,
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
  encase,
  encasePromise
};

//
// Types
//

/**
 * `RemoteData` models the lifecycle of async requests, where data starts
 * uninitialized, a request is made, and then either a successful or
 * unsuccessful response is received. These four stages correspond to the types
 * `NotAsked`, `Loading`, `Success`, and `Failure`. The `Success` type has data
 * of type `D`, while `Failure` can be any object which inherits from the
 * javascript `Error` object.
 */
type RemoteData<D, E extends Error> = NotAsked | Loading | D | E;

/** Alias for the `RemoteData` type. */
type T<D, E extends Error> = RemoteData<D, E>;

/**
 * The `NotAsked` variant of a `RemoteData` represents data that is not yet
 * initialized. Values of this type can be constructed with the `NotAsked`
 * constant.
 */
type NotAsked = symbol & { readonly IsNotasked: unique symbol };

/**
 * The `Loading` variant of a `RemoteData` represents data that is being
 * retrieved. Values of this type can be constructed with the `Loading`
 * constant.
 */
type Loading = symbol & { readonly IsLoading: unique symbol };

/**
 * The `Success` variant of a `RemoteData` is an alias for retrieved data of
 * type `D`. The data can be of any concrete type that isn't an object
 * inheriting from `Error`, or the two constants `NotAsked` and `Loading`.
 */
type Success<D> = Exclude<D, NotAsked | Loading | Error>;

/**
 * The `Failure` variant of a `RemoteData` represents a situation where the data
 * could not be retrieved. It can be any error object which inherits from the
 * default JS `Error` built-in. Values of this type can be created like any
 * normal error object. The provided constructor `Failure` creates a vanilla
 * `Error` object, while `FailureData` creates a `DataError<D>` object which
 * inherits from `Error` but has an additional `data` field containing error
 * data of type `D`.
 */
type Failure<E extends Error> = E;

/* Create a wrapped type where each member of `T` is a `RemoteData`. */
type RemoteDataMapped<T extends ReadonlyArray<any>, E extends Error> = {
  [k in keyof T]: RemoteData<T[k], E>;
};

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<A, E extends Error, R> =
  | {
      NotAsked: () => R;
      Loading: () => R;
      Success: (a: A) => R;
      Failure: (e: E) => R;
    }
  | {
      NotAsked?: () => R;
      Loading?: () => R;
      Success?: (a: A) => R;
      Failure?: (e: E) => R;
      default: () => R;
    };

//
// Constructors
//

/** A constructor for the `NotAsked` variant of `RemoteData`. */
const notAsked: NotAsked = Symbol("NotAsked") as NotAsked;

/** A constructor for the `Loading` variant of `RemoteData`. */
const loading: Loading = Symbol("Loading") as Loading;

/** A constructor for the `Success` variant of `RemoteData`. */
function success<D>(d: Success<D>): Success<D> {
  return d;
}

/**
 * A constructor for the `Failure` variant of `RemoteData`, creates a vanilla
 * `Error` object.
 */
function failure(message?: string): Failure<Error> {
  return new Error(message);
}

/**
 * A constructor for the `Failure` variant of `RemoteData`, creates a
 * `DataError` object.
 */
function failureData<D>(data: D, message?: string): Failure<DataError.T<D>> {
  return DataError.of(data, message);
}

/** Alias for the `success` constructor. */
const of = success;

//
// Typeguards
//

/** Typeguard for the `NotAsked` variant of a `RemoteData`. */
function isNotAsked(x: unknown): x is NotAsked {
  return x === notAsked;
}

/** Typeguard for the `Loading` variant of a `RemoteData`. */
function isLoading(x: unknown): x is Loading {
  return x === loading;
}

/** Typeguard for the `Failure` variant of a `RemoteData`. */
function isFailure<D, E extends Error>(x: RemoteData<D, E>): x is Failure<E> {
  return x instanceof Error;
}

/** Typeguard for the `Success` variant of a `RemoteData`. */
function isSuccess<D, E extends Error>(x: RemoteData<D, E>): x is Success<D> {
  return !isNotAsked(x) && !isLoading(x) && !isFailure(x);
}

/** Typeguard for the `Success` or `Failure` variants of a `RemoteData`. */
function isCompleted<D, E extends Error>(x: RemoteData<D, E>): x is Success<D> | Failure<E> {
  return !isNotAsked(x) && !isLoading(x);
}

//
// Conversions
//

/**
 * Create a `RemoteData` from a `Maybe` by returning either a `NotAsked` or `Success`
 *
 *     Just<A> -> Success<A>
 *     Nothing -> NotAsked
 */
const fromMaybe = Maybe.toRemoteData;

/**
 * Create a `RemoteData` from a `Result`. Since the `Result` type is a subset
 * of `RemoteData` this is a lossless typecast.
 *
 *     Ok<V>  -> Success<V>
 *     Err<E> -> Failure<E>
 */
const fromResult = Result.toRemoteData;

/**
 * Create a `Maybe` from a `RemoteData` by mapping `Success` to
 * `Just` and everything else to `Nothing`.
 *
 *     NotAsked         -> Nothing
 *     Loading          -> Nothing
 *     Success<V>       -> Just<V>
 *     Err<E>           -> Nothing
 */
function toMaybe<D, E extends Error>(x: RemoteData<D, E>): Maybe.T<Success<D>> {
  return isSuccess(x) ? x : undefined;
}

/**
 * Create a `Result` from a `RemoteData`, where the incomplete statuses map to
 * `Maybe.Nothing`.
 *
 *     NotAsked   -> Ok<Nothing>
 *     Loading    -> Ok<Nothing>
 *     Success<V> -> Ok<V>
 *     Failure<E> -> Err<E>
 */
function toResult<D, E extends Error>(x: RemoteData<D, E>): Result.T<Maybe.T<D>, E> {
  return isCompleted(x) ? x : undefined;
}

//
// Operations
//

/** Apply `fn` if `a` is a `Success`. Otherwise return the non-success value. */
function map<E extends Error>(a: E, fn: (a: any) => any): E;
function map(a: NotAsked, fn: (a: any) => any): NotAsked;
function map(a: Loading, fn: (a: any) => any): Loading;
function map<A, B>(a: Success<A>, fn: (a: Success<A>) => B): B;
function map<A, B, E extends Error>(
  a: RemoteData<Success<A>, E>,
  fn: (a: Success<A>) => Success<B>
): RemoteData<Success<B>, E>;
function map<A, B, E extends Error>(
  a: RemoteData<Success<A>, E>,
  fn: (a: Success<A>) => B
): RemoteData<Success<B>, Extract<E | B, Error>>;
function map<A>(a: RemoteData<A, Error>, fn: (a: A) => any) {
  return isSuccess(a) ? fn(a) : a;
}

/** Apply `fn` if `x` is a `Failure`. Otherwise return the non-failure value. */
function mapFailure<A, B, E extends Error>(a: Success<A>, fn: (e: E) => B): Success<A>;
function mapFailure<A, B, E extends Error>(a: NotAsked, fn: (a: E) => B): NotAsked;
function mapFailure<A, B, E extends Error>(a: Loading, fn: (a: E) => B): Loading;
function mapFailure<A, B, E extends Error>(a: E, fn: (e: E) => B): B;
function mapFailure<A, B, E extends Error>(
  a: RemoteData<Success<A>, E>,
  fn: (e: E) => Success<B>
): Success<A | B>;
function mapFailure<A, B, EA extends Error, EB extends Error>(
  a: RemoteData<Success<A>, EA>,
  fn: (e: EA) => RemoteData<Success<B>, EB>
): RemoteData<Success<A | B>, EB>;
function mapFailure<A, B, E extends Error>(a: RemoteData<A, E>, fn: (e: E) => B) {
  return isFailure(a) ? fn(a) : a;
}

/**
 * Like a `case` in languages with pattern matching. Apply the appropriate function
 * depending on the data's status.
 */
function unwrap<A, B, E extends Error>(
  x: RemoteData<A, E>,
  notAskedFn: () => B,
  loadingFn: () => B,
  successFn: (a: A) => B,
  failureFn: (e: E) => B
): B {
  if (isSuccess(x)) {
    return successFn(x);
  } else if (isFailure(x)) {
    return failureFn(x);
  } else if (isNotAsked(x)) {
    return notAskedFn();
  } else {
    return loadingFn();
  }
}

/**
 * Simulates an ML style `case x of` pattern match, following the same logic as
 * `unwrap`.
 */
function caseOf<A, E extends Error, R>(x: RemoteData<A, E>, pattern: CaseOfPattern<A, E, R>): R {
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
}

/**
 * If all values in the `xs` array are `Success`es then return the array. Otherwise
 * return the first non-success value.
 */
function combine<T extends ReadonlyArray<any>, E extends Error>(
  xs: RemoteDataMapped<T, E>
): RemoteData<T, E>;
function combine<A, E extends Error>(xs: ReadonlyArray<RemoteData<A, E>>): RemoteData<A[], E>;
function combine(xs: ReadonlyArray<RemoteData<unknown, Error>>) {
  const firstNonSuccess = xs.find((x) => !isSuccess(x));
  return firstNonSuccess !== undefined ? firstNonSuccess : xs.filter(isSuccess);
}

/**
 * Create a version of a function which returns a `Success` or `Failure`
 * instead of throwing an error.
 */
function encase<Args extends Array<any>, V, E extends Error>(
  fn: (...args: Args) => V,
  onThrow: (e: unknown) => E
): (...args: Args) => RemoteData<V, E> {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch (e) {
      return onThrow(e);
    }
  };
}

/**
 * Given a promise, return a promise which will always fulfill, catching
 * rejected values in a `Failure`.
 *
 *    fulfilled Promise<V> -> fulfilled Promise<Success<V>>
 *    rejected Promise<V>  -> fulfilled Promise<Failure<E>>
 */
function encasePromise<V, E extends Error>(
  p: Promise<Success<V>>,
  onReject: (e: unknown) => E
): Promise<RemoteData<Success<V>, E>> {
  return p.catch((e: unknown) => onReject(e));
}
