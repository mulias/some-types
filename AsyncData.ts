import * as Maybe from "./Maybe";
import * as Result from "./Result";
import { ErrorValue, isErrorValue, fromError } from "./ErrorValue";

export {
  // Types
  AsyncData,
  T,
  // Constructors
  NotAsked,
  Loading,
  Success,
  Failure,
  // Typeguards
  isNotAsked,
  isLoading,
  isSuccess,
  isFailure,
  isCompleted,
  // Conversions
  fromMaybe,
  fromResult,
  fromPromise,
  toMaybe,
  toResult,
  // Operations
  map,
  mapFailure,
  unwrap,
  caseOf,
  combine
};

//
// Types
//

/**
 * `AsyncData` models the lifecycle of async requests, where data starts
 * uninitialized, a request is made, and then either a successful or
 * unsuccessful response is received. These four stages correspond to the types
 * `NotAsked`, `Loading`, `Success`, and `Failure`. The `Success` type has data
 * of type `D`, while `Failure` is an error object with a value of type `E`.
 */
type AsyncData<D, E> = NotAsked | Loading | Success<D> | Failure<E>;

/** Alias for the `AsyncData` type. */
type T<D, E> = AsyncData<D, E>;

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
 * type `D`. Values of this type can be constructed with the `Success`
 * function.
 */
type Success<D> = D;

/**
 * The `Failure` variant of a `AsyncData` represents data that could not be
 * retrieved. The error object inherits from the default JS `Error` built-in,
 * and contains some error value of type `E`. Values of this type can be
 * constructed with the `Failure` function.
 */
type Failure<E> = ErrorValue<E>;

/* Create a wrapped type where each member of `T` is a `AsyncData` with error
 * value `E`.
 */
type AsyncDataMapped<T, E> = { [k in keyof T]: AsyncData<T[k], E> };

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<A, B, E> =
  | {
      NotAsked: () => B;
      Loading: () => B;
      Success: (a: A) => B;
      Failure: (e: Failure<E>) => B;
    }
  | {
      NotAsked?: () => B;
      Loading?: () => B;
      Success?: (a: A) => B;
      Failure?: (e: Failure<E>) => B;
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
const Success = <D>(d: D): Success<D> => d;

/** A constructor for the `Failure` variant of `AsyncData`. */
function Failure(e?: undefined): Failure<undefined>;
function Failure<E>(e: E): Failure<E>;
function Failure(e: any) {
  return new ErrorValue(e);
}

//
// Typeguards
//

/** Typeguard for the `NotAsked` variant of a `AsyncData`. */
const isNotAsked = (x: unknown): x is NotAsked => x === NotAsked;

/** Typeguard for the `Loading` variant of a `AsyncData`. */
const isLoading = (x: unknown): x is Loading => x === Loading;

/** Typeguard for the `Failure` variant of a `AsyncData`. */
const isFailure = <D, E>(x: AsyncData<D, E>): x is Failure<E> => x instanceof Failure;

/** Typeguard for the `Success` variant of a `AsyncData`. */
const isSuccess = <D, E>(x: AsyncData<D, E>): x is Success<D> =>
  !isNotAsked(x) && !isLoading(x) && !isFailure(x);

/** Typeguard for the `Success` and `Failure` variant of a `AsyncData`. */
const isCompleted = <D, E>(x: AsyncData<D, E>): x is Success<D> | Failure<E> =>
  isSuccess(x) || isFailure(x);

//
// Conversions
//

/**
 * Create a `AsyncData` from a `Maybe` by returning either a `NotAsked` or `Success`
 *
 *     Just<A> -> Success<A>
 *     Nothing -> NotAsked
 */
const fromMaybe = Maybe.toAsyncData;

/**
 * Create a `AsyncData` from a `Result`. Since the `Result` type is a subset
 * of `AsyncData` this is a lossless typecast.
 *
 *     Ok<V>  -> Success<V>
 *     Err<E> -> Failure<E>
 */
const fromResult = Result.toAsyncData;

/**
 * Given a promise, create a promise which will immediately fulfill with a
 * `AsyncData` value corresponding to the current lifecycle stage of the input
 * promise.
 *
 *     null | undefined      -> Promise<NotAsked>
 *     unresolved Promise<D> -> Promise<Loading>
 *     fulfilled Promise<D>  -> Promise<Success<D>>
 *     rejected Promise<D>   -> Promise<Failure<unknown>>
 */
const fromPromise = <D, E = unknown>(
  p: Promise<D> | null | undefined
): Promise<AsyncData<D, E>> => {
  if (p == null) {
    return Promise.resolve(NotAsked);
  }

  const placeholder = {};
  return Promise.race([p, placeholder]).then(
    (d) => (d === placeholder ? Loading : (Success(d) as Success<D>)),
    (e) => Failure(e)
  );
};

/**
 * Create a `Maybe` from a `AsyncData` by mapping `Success` to
 * `Just` and everything else to `Nothing`.
 *
 *     NotAsked   -> Nothing
 *     Loading    -> Nothing
 *     Success<V> -> Just<V>
 *     Err<E>     -> Nothing
 */
const toMaybe = <D, E>(x: AsyncData<D, E>): Maybe.T<D> =>
  isSuccess(x) ? Maybe.Just(x) : Maybe.Nothing;

/**
 * Create a `Result` from a `AsyncData`, where the incomplete statuses map to
 * `Maybe.Nothing`.
 *
 *     NotAsked   -> Ok<Nothing>
 *     Loading    -> Ok<Nothing>
 *     Success<V> -> Ok<V>
 *     Failure<E> -> Err<E>
 */
const toResult = <D, E>(x: AsyncData<D, E>): Result.T<Maybe.T<D>, E> =>
  isCompleted(x) ? (x as Result.T<D, E>) : Maybe.Nothing;

//
// Operations
//

/**
 * Apply `fn` if all of `remoteDataArgs` are `Success`es. Otherwise
 * return the first non `Success` value.
 */
const map = <Args extends any[], R, E>(
  fn: (...args: Args) => AsyncData<R, E>,
  ...remoteDataArgs: AsyncDataMapped<Args, E>
): AsyncData<R, E> => {
  const firstNonSuccess = remoteDataArgs.find((a) => !isSuccess(a));
  const successVals = remoteDataArgs.filter(isSuccess);
  return firstNonSuccess === undefined ? fn(...(successVals as Args)) : firstNonSuccess;
};

/**
 * Apply `fn` if `x` is a `Failure`. Note that in order to change the error
 * value, `fn` will either have to mutate the object, or create a new
 * object. Both options have pitfalls in different contexts.
 */
const mapFailure = <D, A, B>(
  fn: (a: Failure<A>) => AsyncData<D, B>,
  x: AsyncData<D, A>
): AsyncData<D, B> => (isFailure(x) ? fn(x) : x);

/**
 * Like a `case` in languages with pattern matching. Apply the appropriate function
 * depending on the data's status.
 */
const unwrap = <A, B, E>(
  notAskedFn: () => B,
  loadingFn: () => B,
  successFn: (a: A) => B,
  failureFn: (e: Failure<E>) => B,
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
const caseOf = <A, B, E>(pattern: CaseOfPattern<A, B, E>, x: AsyncData<A, E>): B => {
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
const combine = <A, E>(xs: ReadonlyArray<AsyncData<A, E>>): AsyncData<A[], E> => {
  const firstNonSuccess = xs.find((x) => !isSuccess(x)) as NotAsked | Loading | Failure<E>;
  const successVals = xs.filter(isSuccess);
  return firstNonSuccess === undefined ? successVals : firstNonSuccess;
};
