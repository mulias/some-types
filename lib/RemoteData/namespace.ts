import { DataError } from "../DataError/namespace";
import { Option } from "../Option/namespace";
import { Result } from "../Result/namespace";
import { NotAsked, NotAsked as NotAskedImpl } from "./NotAsked/namespace";
import { Loading, Loading as LoadingImpl } from "./Loading/namespace";
import { Success, Success as SuccessImpl } from "./Success/namespace";
import { Failure, Failure as FailureImpl } from "./Failure/namespace";
import {
  IsAnyOrUnknown,
  NonAnyOrUnknownElements,
  ErrorElements,
} from "../util/type";

/**
 *
 * Type: `RemoteData<D, E>` models the lifecycle of async requests, where data
 * starts uninitialized, a request is made, and then either a successful or
 * unsuccessful response is received. These four stages correspond to the types
 * `NotAsked`, `Loading`, `Success<D>`, and `Failure<E>`. The `Success` type is
 * the desired value of type `D`, while `Failure` is an error object `E`.
 *
 */
export type RemoteData<D, E extends Error> =
  | RemoteData.NotAsked
  | RemoteData.Loading
  | D
  | E;

export declare namespace RemoteData {
  export { NotAsked, Loading, Success, Failure };
}

/**
 *
 * Namespace: The `RemoteData` namespace contains functions for `RemoteData`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace RemoteData {
  //
  // Namespaces
  //

  RemoteData.NotAsked = NotAskedImpl;
  RemoteData.Loading = LoadingImpl;
  RemoteData.Success = SuccessImpl;
  RemoteData.Failure = FailureImpl;

  //
  // Types
  //

  type NotAsked = RemoteData.NotAsked;
  type Loading = RemoteData.Loading;
  type Success<D> = RemoteData.Success<D>;
  type Failure<E> = RemoteData.Failure<E>;

  /* Create a version of an Array or Tuple type with only the `Success` values
   * for each element.
   */
  type SuccessMapped<T extends ReadonlyArray<any>> = {
    [k in keyof T]: Success<T[k]>;
  };

  /* All NotAsked, Loading, and Error types present in an array. */
  type NonSuccessElements<T extends ReadonlyArray<any>> =
    | Extract<NonAnyOrUnknownElements<T>, NotAsked | Loading>
    | ErrorElements<T>;

  /* Predicate to test if every array element is a Success. */
  type IsAllSuccess<T extends ReadonlyArray<any>> =
    NonSuccessElements<T> extends never ? 1 : 0;

  /* Predicate to test if at least one array element is strictly non-Success. */
  type HasStrictlyNonSuccessElement<T extends ReadonlyArray<any>> = {
    [k in keyof T]: IsAnyOrUnknown<T[k]> extends 0
    ? Exclude<T[k], NotAsked | Loading | Error> extends never
    ? T[k]
    : never
    : never;
  }[number] extends never
    ? 0
    : 1;

  /* Transform type with shape `RemoteData<D, E>[]` into `RemoteData<D[], E>`,
   * while preserving readonly arrays and tuples.
   */
  type Consolidate<T extends ReadonlyArray<any>> =
    HasStrictlyNonSuccessElement<T> extends 1
    ? NonSuccessElements<T>
    : IsAllSuccess<T> extends 1
    ? T
    : RemoteData<SuccessMapped<T>, ErrorElements<T>>;

  /* The `match` function expects either exhaustive pattern matching, or
   * non-exhaustive with a `default` case.
   */
  type MatchPattern<A, B> =
    | {
      NotAsked: () => B;
      Loading: () => B;
      Success: (a: Success<A>) => B;
      Failure: (e: Failure<A>) => B;
    }
    | {
      NotAsked?: () => B;
      Loading?: () => B;
      Success?: (a: Success<A>) => B;
      Failure?: (e: Failure<A>) => B;
      default: () => B;
    };

  type ExcludeSuccess<A> = Extract<A, NotAsked | Loading | Error>;

  //
  // Constructors
  //

  /** A constructor for the `NotAsked` variant of `RemoteData`. */
  export const notAsked = NotAsked.value;

  /** A constructor for the `Loading` variant of `RemoteData`. */
  export const loading = Loading.value;

  /** A constructor for the `Success` variant of `RemoteData`. */
  export const success = Success.of;

  /** A constructor for the `Success` variant of `RemoteData`. */
  export const of = Success.of;

  /**
   * A constructor for the `Failure` variant of `RemoteData`, creates a vanilla
   * `Error` object.
   */
  export const failure = Failure.of;

  /**
   * A constructor for the `Failure` variant of `RemoteData`, creates a
   * `DataError` object.
   */
  export const failureData = Failure.withData;

  //
  // Typeguards
  //

  /** Typeguard for the `NotAsked` variant of a `RemoteData`. */
  export const isNotAsked = NotAsked.isType;

  /** Typeguard for the `Loading` variant of a `RemoteData`. */
  export const isLoading = Loading.isType;

  /** Typeguard for the `Failure` variant of a `RemoteData`. */
  export const isFailure = Failure.isType;

  /** Typeguard for the `Success` variant of a `RemoteData`. */
  export const isSuccess = Success.isType;

  /** Typeguard for the `Success` or `Failure` variants of a `RemoteData`. */
  export function isCompleted<A>(x: A): x is Success<A> | Failure<A> {
    return !isNotAsked(x) && !isLoading(x);
  }

  //
  // Conversions
  //

  /**
   * Create a `RemoteData` from a `Option` by returning either a `NotAsked` or `Success`
   *
   *     Some<A> -> Success<A>
   *     None    -> NotAsked
   */
  export function fromOption<V>(
    x: Option<V>,
  ): Success<Option.Some<V>> | NotAsked {
    return Option.isNone(x) ? notAsked : (x as Success<Option.Some<V>>);
  }

  /**
   * Create a `RemoteData` from a `Result`. Since the `Result` type is a subset
   * of `RemoteData` this is a lossless typecast.
   *
   *     Ok<V>  -> Success<V>
   *     Err<E> -> Failure<E>
   */
  export function fromResult<A>(x: A): RemoteData<Result.Ok<A>, Result.Err<A>> {
    return x as RemoteData<Result.Ok<A>, Result.Err<A>>;
  }

  /**
   * Create a `Option` from a `RemoteData` by mapping `Success` to
   * `Some` and everything else to `None`.
   *
   *     NotAsked   -> None
   *     Loading    -> None
   *     Success<V> -> Some<V>
   *     Err<E>     -> None
   */
  export function toOption<A>(x: Success<A>): Success<A>;
  export function toOption<A extends NotAsked | Loading | Error>(
    x: A,
  ): Option.None;
  export function toOption<A>(x: A): Option<Success<A>>;
  export function toOption(x: unknown) {
    return isSuccess(x) ? x : undefined;
  }

  /**
   * Create a `Result` from a `RemoteData`, where the incomplete statuses map to
   * `Option.None`.
   *
   *     NotAsked   -> Ok<None>
   *     Loading    -> Ok<None>
   *     Success<V> -> Ok<V>
   *     Failure<E> -> Err<E>
   */
  export function toResult(x: NotAsked | Loading): Result.Ok<Option.None>;
  export function toResult<A>(x: Success<A>): Result.Ok<Success<A>>;
  export function toResult<A>(x: Failure<A>): Result.Err<Failure<A>>;
  export function toResult<A>(x: A): Result<Option<Success<A>>, Failure<A>>;
  export function toResult(x: unknown) {
    return isCompleted(x) ? x : undefined;
  }

  /**
   * Assert that `x` is `NotAsked`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export const coerceNotAsked = NotAsked.coerce;

  /**
   * Assert that `x` is `Loading`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export const coerceLoading = Loading.coerce;

  /**
   * Assert that `x` is a `Success`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export const coerceSuccess = Success.coerce;

  /**
   * Assert that `x` is a `Failure`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export const coerceFailure = Failure.coerce;

  //
  // Operations
  //

  /** Call `fn` if `a` is `NotAsked`. Otherwise return the value. */
  export const ifNotAsked = NotAsked.ifType;

  /** Call `fn` if `x` is `Loading`. Otherwise return the non-loading value. */
  export const ifLoading = Loading.ifType;

  /** Apply `fn` if `a` is a `Success`. Otherwise return the non-success value. */
  export const ifSuccess = Success.ifType;

  /** Apply `fn` if `x` is a `Failure`. Otherwise return the non-failure value. */
  export const ifFailure = Failure.ifType;

  /**
   * Provide a default which is used when `x` is not a `Success` value.
   */
  export function orDefault<A>(x: Success<A>, defaultVal: any): Success<A>;
  export function orDefault<A, B>(x: ExcludeSuccess<A>, defaultVal: B): B;
  export function orDefault<A, B>(x: A, defaultVal: Success<B>): Success<A | B>;
  export function orDefault<A, B>(
    x: A,
    defaultVal: B,
  ): RemoteData<Success<A | B>, Failure<B>>;
  export function orDefault(x: unknown, defaultVal: unknown) {
    return isSuccess(x) ? x : defaultVal;
  }

  /** Return `x` if it's a `Success` value, otherwise throw the `Failure`. */
  export function orThrow<A>(x: A): Success<A> {
    if (isSuccess(x)) {
      return x;
    } else {
      throw x;
    }
  }

  /**
   * Similar to a `case` expression in languages with pattern matching. The
   * `pattern` object either needs to be exhastive or needs to have a `default`
   * branch.
   */
  export function match<A, B>(x: A, pattern: MatchPattern<A, B>): B {
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
   * If all values in the `xs` array are `Success`es then return the array.
   * Otherwise return the first non-success value. At a type level this function
   * takes values of type `RemoteData<V, E>[]` and returns values of type
   * `RemoteData<V[], E>`.
   */
  export function consolidate<T extends ReadonlyArray<any>>(
    xs: T,
  ): Consolidate<T>;
  export function consolidate<A>(
    xs: ReadonlyArray<RemoteData<Success<A>, Failure<A>>>,
  ): RemoteData<Array<Success<A>>, Failure<A>>;
  export function consolidate(xs: ReadonlyArray<unknown>) {
    const firstNonSuccess = xs.find((x) => !isSuccess(x));
    return firstNonSuccess !== undefined
      ? firstNonSuccess
      : xs.filter(isSuccess);
  }

  /**
   * Create a version of a function which returns a `RemoteData` value instead
   * of throwing an error.  If the optional `onThrow` argument is provided then
   * the function is called to transform the thrown value into an `Err`. If
   * `onThrow` is not provided then the thrown value is returned as-is if it's
   * already an `Error`, otherwise the value is interpolated into a generic
   * error message and data might be lost.
   */
  export function encase<Args extends Array<any>, A, E extends Error>(
    fn: (...args: Args) => A,
    onThrow: (e: unknown) => E,
  ): (...args: Args) => RemoteData<Success<A>, Failure<A | E>>;
  export function encase<Args extends Array<any>, A>(
    fn: (...args: Args) => A,
  ): (...args: Args) => RemoteData<Success<A>, Failure<A> | Error>;
  export function encase<Args extends Array<any>, A, E extends Error>(
    fn: (...args: Args) => A,
    onThrow?: (e: unknown) => E,
  ) {
    return (...args: Args) => {
      try {
        return fn(...args) as any;
      } catch (e) {
        if (onThrow) {
          return onThrow(e);
        } else if (isFailure(e)) {
          return e;
        } else {
          return failure(`caught thrown value ${e}`);
        }
      }
    };
  }

  /**
   * Create a version of a function which returns a `RemoteData` value instead
   * throwing an error. If the optional `onThrow` argument is provided then the
   * function is called to transform the thrown value, and then the value is
   * wrapped in a `DataError` object. If `onThrow` is not provided then the
   * thrown value is simply wrapped in a `DataError`.
   */
  export function encaseWithData<Args extends Array<any>, A, B>(
    fn: (...args: Args) => A,
    onThrow: (e: unknown) => B,
  ): (...args: Args) => Result<Success<A>, Failure<A> | DataError<B>>;
  export function encaseWithData<Args extends Array<any>, A>(
    fn: (...args: Args) => A,
  ): (...args: Args) => Result<Success<A>, Failure<A> | DataError<unknown>>;
  export function encaseWithData<Args extends Array<any>, A, B>(
    fn: (...args: Args) => A,
    onThrow?: (e: unknown) => B,
  ) {
    return (...args: Args) => {
      try {
        return fn(...args);
      } catch (e: unknown) {
        if (onThrow) {
          return failureData(onThrow(e));
        } else {
          return failureData(e);
        }
      }
    };
  }

  /**
   * Given a promise, return a promise which will always fulfill. If the
   * optional `onReject` argument is provided then the function is called to
   * transform the rejected value into a `Failure`. If `onReject` is not provided
   * then the rejected value is returned as-is if it's already an `Error`,
   * otherwise the value is interpolated into a generic error message and data
   * might be lost.
   */
  export async function encasePromise<A, E extends Error>(
    p: PromiseLike<A>,
    onReject: (e: unknown) => E,
  ): Promise<RemoteData<Success<A>, Failure<A | E>>>;
  export async function encasePromise<A>(
    p: PromiseLike<A>,
  ): Promise<RemoteData<Success<A>, Failure<A> | Error>>;
  export async function encasePromise<A, E extends Error>(
    p: PromiseLike<A>,
    onReject?: (e: unknown) => E,
  ) {
    try {
      return (await p) as any;
    } catch (e) {
      if (onReject) {
        return onReject(e);
      } else if (isFailure(e)) {
        return e;
      } else {
        return failure(`caught rejected value ${e}`);
      }
    }
  }

  /**
   * Given a promise, return a promise which will always fulfill. If the
   * optional `onReject` argument is provided then the function is called to
   * transform the rejected value, and then the value is wrapped in a
   * `DataError` object. If `onReject` is not provided then the rejected value
   * is simply wrapped in a `DataError`.
   */
  export async function encasePromiseWithData<A, B>(
    p: PromiseLike<A>,
    onReject: (e: unknown) => B,
  ): Promise<RemoteData<Success<A>, Failure<A> | DataError<B>>>;
  export async function encasePromiseWithData<A>(
    p: PromiseLike<A>,
  ): Promise<RemoteData<Success<A>, Failure<A> | DataError<unknown>>>;
  export async function encasePromiseWithData<A, B>(
    p: PromiseLike<A>,
    onReject?: (e: unknown) => B,
  ) {
    try {
      return await p;
    } catch (e) {
      if (onReject) {
        return failureData(onReject(e));
      } else {
        return failureData(e);
      }
    }
  }
}
