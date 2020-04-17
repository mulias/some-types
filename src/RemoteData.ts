import * as Maybe from "./Maybe";
import * as Result from "./Result";
import { ErrorValue, isErrorValue, fromError } from "./ErrorValue";

export {
  // Types
  RemoteData,
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

/** TODO */
type RemoteData<D, E> = NotAsked | Loading | Success<D> | Failure<E>;

/** TODO */
type T<D, E> = RemoteData<D, E>;

/** TODO */
type NotAsked = typeof NotAsked;

/** TODO */
type Loading = typeof Loading;

/** TODO */
type Success<D> = D;

/** TODO */
type Failure<E> = ErrorValue<E>;

/*
 * Create a wrapped type where each member of `T` is a `RemoteData` with error
 * value `E`.
 */
type RemoteDataMapped<T, E> = { [k in keyof T]: RemoteData<T[k], E> };

/* TODO */
type CaseOfPatterns<A, B, E> =
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

/** TODO */
const NotAsked: unique symbol = Symbol("NotAsked");

/** TODO */
const Loading: unique symbol = Symbol("Loading");

/** TODO */
const Success = <D>(d: D): Success<D> => d;

/** TODO */
const Failure = <E>(e: E): Failure<E> => new ErrorValue(e);

//
// Typeguards
//

/** TODO */
const isNotAsked = (x: unknown): x is NotAsked => x === NotAsked;

/** TODO */
const isLoading = (x: unknown): x is Loading => x === Loading;

/** TODO */
const isFailure = <D, E>(x: RemoteData<D, E>): x is Failure<E> => x instanceof Failure;

/** TODO */
const isSuccess = <D, E>(x: RemoteData<D, E>): x is Success<D> =>
  !isNotAsked(x) && !isLoading(x) && !isFailure(x);

/** TODO */
const isCompleted = <D, E>(x: RemoteData<D, E>): x is Success<D> | Failure<E> =>
  isSuccess(x) || isFailure(x);

//
// Conversions
//

/** TODO */
const fromMaybe = Maybe.toRemoteData;

/** TODO */
const fromResult = Result.toRemoteData;

/** TODO */
const fromPromise = <D, E = unknown>(
  p: Promise<D> | null | undefined
): Promise<RemoteData<D, E>> => {
  if (p == null) {
    return Promise.resolve(NotAsked);
  }

  const placeholder = {};
  return Promise.race([p, placeholder]).then(
    (d) => (d === placeholder ? Loading : (Success(d) as Success<D>)),
    (e) => Failure(e)
  );
};

/** TODO */
const toMaybe = <D, E>(x: RemoteData<D, E>): Maybe.T<D> =>
  isSuccess(x) ? Maybe.Just(x) : Maybe.Nothing;

/** TODO */
const toResult = <D, E>(x: RemoteData<D, E>): Result.T<Maybe.T<D>, E> =>
  isCompleted(x) ? (x as Result.T<D, E>) : Maybe.Nothing;

//
// Operations
//

/** TODO */
const map = <Args extends any[], R, E>(
  fn: (...args: Args) => RemoteData<R, E>,
  ...remoteDataArgs: RemoteDataMapped<Args, E>
): RemoteData<R, E> => {
  const firstNonSuccess = remoteDataArgs.find((a) => !isSuccess(a));
  const successVals = remoteDataArgs.filter(isSuccess);
  return firstNonSuccess === undefined ? fn(...(successVals as Args)) : firstNonSuccess;
};

/** TODO */
const mapFailure = <D, A, B>(
  fn: (a: Failure<A>) => RemoteData<D, B>,
  x: RemoteData<D, A>
): RemoteData<D, B> => (isFailure(x) ? fn(x) : x);

/** TODO */
const unwrap = <A, B, E>(
  notAskedFn: () => B,
  loadingFn: () => B,
  successFn: (a: A) => B,
  failureFn: (e: Failure<E>) => B,
  x: RemoteData<A, E>
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

/** TODO */
const caseOf = <A, B, E>(pattern: CaseOfPatterns<A, B, E>, x: RemoteData<A, E>): B => {
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
const combine = <A, E>(xs: ReadonlyArray<RemoteData<A, E>>): RemoteData<A[], E> => {
  const firstNonSuccess = xs.find((x) => !isSuccess(x)) as NotAsked | Loading | Failure<E>;
  const successVals = xs.filter(isSuccess);
  return firstNonSuccess === undefined ? successVals : firstNonSuccess;
};
