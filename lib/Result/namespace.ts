import { DataError } from "../DataError/namespace";
import { Err, Err as ErrImpl } from "./Err/namespace";
import { Option } from "../Option/namespace";
import { Ok, Ok as OkImpl } from "./Ok/namespace";
import { RemoteData } from "../RemoteData/namespace";
import { IsAnyOrUnknown, ErrorElements } from "../type_util";

/**
 *
 * Type: A `Result<V, E>` is the result of a computation that might fail.
 * Values of this type are either `Ok<V>`, a desired value of type `V`, or
 * `Err<E>`, an error object `E` specifying what went wrong.
 *
 */
export type Result<V, E extends Error> = V | E;

export declare namespace Result {
  export { Ok, Err };
}

/**
 *
 * Namespace: The `Result` namespace contains functions for `Result` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Result {
  //
  // Namespaces
  //

  Result.Ok = OkImpl;
  Result.Err = ErrImpl;

  //
  // Types
  //

  /**
   * The `Ok` variant of a `Result` is an alias for non-error values of type `V`.
   * The value can be of any concrete type that isn't an object inheriting from
   * `Error`.
   */
  type Ok<V> = Result.Ok<V>;

  /**
   * The `Err` variant of a `Result` is any object which inherits from the default
   * JS `Error` built-in. Values of this type can be created like any normal
   * error object. The provided constructor `err` creates a vanilla `Error` object,
   * while `errData` creates a `DataError<D>` object which inherits from `Error`
   * but has an additional `data` field containing error data of type `D`.
   */
  type Err<E> = Result.Err<E>;

  /* Create a version of an Array or Tuple type with only the `Ok` values for
   * each element.
   */
  type OkMapped<T extends ReadonlyArray<any>> = {
    [k in keyof T]: Ok<T[k]>;
  };

  /* Predicate to test if every array element is as Ok. */
  type IsAllOk<T extends ReadonlyArray<any>> = ErrorElements<T> extends never
    ? 1
    : 0;

  /* Predicate to test if at least one array element is strictly an Error. */
  type HasStrictlyErrorElement<T extends ReadonlyArray<any>> = {
    [k in keyof T]: IsAnyOrUnknown<T[k]> extends 0
    ? Exclude<T[k], Error> extends never
    ? T[k]
    : never
    : never;
  }[number] extends never
    ? 0
    : 1;

  /* Transform type with shape `Result<V, E>[]` into `Result<V[], E>`,
   * while preserving readonly arrays and tuples.
   */
  type Consolidate<T extends ReadonlyArray<any>> =
    HasStrictlyErrorElement<T> extends 1
    ? ErrorElements<T>
    : IsAllOk<T> extends 1
    ? T
    : Result<OkMapped<T>, ErrorElements<T>>;

  /* The `caseOf` function expects either exhaustive pattern matching, or
   * non-exhaustive with a `default` case.
   */
  type CaseOfPattern<A, B> =
    | {
      Ok: (a: Ok<A>) => B;
      Err: (e: Err<A>) => B;
    }
    | {
      Ok?: (a: Ok<A>) => B;
      Err?: (e: Err<A>) => B;
      default: () => B;
    };

  //
  // Constructors
  //

  /** A constructor for the `Ok` variant of `Result`. */
  export const ok = Ok.of;

  /** A constructor for the `Ok` variant of `Result`. */
  export const of = Ok.of;

  /**
   * A constructor for the `Err` variant of `Result`, creates a vanilla `Error`
   * object.
   */
  export const err = Err.of;

  /**
   * A constructor for the `Err` variant of `Result`, creates a `DataError`
   * object.
   */
  export const errData = Err.withData;

  //
  // Typeguards
  //

  /** Typeguard for the `Ok` variant of a `Result`. */
  export const isOk = Ok.isType;

  /** Typeguard for the `Err` variant of a `Result`. */
  export const isErr = Err.isType;

  //
  // Conversions
  //

  /**
   * Create a `Result` from a `Option` by providing the `Err` to use in place of a `None`.
   *
   *     Some<A> -> Ok<A>
   *     None    -> Err<E>
   */
  export function fromOption<V, E extends Error>(
    x: Option<V>,
    e: E,
  ): Result<Option.Some<V>, E> {
    return Option.isSome(x) ? x : e;
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
  export function fromRemoteData(
    x: RemoteData.NotAsked | RemoteData.Loading,
  ): Ok<Option.None>;
  export function fromRemoteData<A>(
    x: RemoteData.Success<A>,
  ): Ok<RemoteData.Success<A>>;
  export function fromRemoteData<A>(
    x: RemoteData.Failure<A>,
  ): Err<RemoteData.Failure<A>>;
  export function fromRemoteData<A>(
    x: A,
  ): Result<Option<RemoteData.Success<A>>, RemoteData.Failure<A>>;
  export function fromRemoteData(x: unknown) {
    return RemoteData.isCompleted(x) ? x : undefined;
  }

  /**
   * Create a `Option` from a `Result` by replacing an `Err` with `None`.
   *
   *     Ok<V>  -> Some<V>
   *     Err<E> -> None
   */
  export function toOption<A>(x: A): Option<Ok<A>> {
    return isOk(x) ? x : undefined;
  }

  /**
   * Create a `RemoteData` from a `Result`. Since the `Result` type is a subset
   * of `RemoteData` this is a lossless typecast.
   *
   *     Ok<V>  -> Success<V>
   *     Err<E> -> Failure<E>
   */
  export function toRemoteData<A>(x: A): RemoteData<Ok<A>, Err<A>> {
    return x as RemoteData<Ok<A>, Err<A>>;
  }

  /**
   * Assert that `x` is an `Ok`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export const coerceOk = Ok.coerce;

  /**
   * Assert that `x` is an `Err`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export const coerceErr = Err.coerce;

  //
  // Operations
  //

  /** Apply `fn` if `a` is an `Ok`. Otherwise return the `Err`. */
  export const ifOk = Ok.ifType;

  /**
   * Apply `fn` if `x` is an `Err`. Note that in order to change the error
   * value, `fn` will either have to mutate the object, or create a new
   * object.
   */
  export const ifErr = Err.ifType;

  /**
   * Provide a default which is used if `x` is an `Err`.
   */
  export function orDefault<A>(x: Ok<A>, defaultVal: any): Ok<A>;
  export function orDefault<A, B>(x: Err<A>, defaultVal: B): B;
  export function orDefault<A, B>(x: A, defaultVal: Ok<B>): Ok<A | B>;
  export function orDefault<A, B>(
    x: A,
    defaultVal: B,
  ): Result<Ok<A | B>, Err<B>>;
  export function orDefault(x: unknown, defaultVal: unknown) {
    return isOk(x) ? x : defaultVal;
  }

  /** Return `x` if it's an `Ok`, otherwise throw the `Err`. */
  export function orThrow<A>(x: A): Ok<A> {
    if (isOk(x)) {
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
  export function caseOf<A, B>(x: A, pattern: CaseOfPattern<A, B>): B {
    if (isOk(x) && pattern["Ok"]) {
      return pattern["Ok"](x);
    } else if (isErr(x) && pattern["Err"]) {
      return pattern["Err"](x);
    } else {
      return (pattern as any)["default"]();
    }
  }

  /**
   * If all values in the `xs` array are `Ok`s then return the array. If any
   * value is an `Err` then return the first error value. At a type level this
   * function takes values of type `Result<A, E>[]` and returns values of type
   * `Result<A[], E>`.
   */
  export function consolidate<T extends ReadonlyArray<any>>(
    xs: T,
  ): Consolidate<T>;
  export function consolidate<A>(
    xs: Array<Result<Ok<A>, Err<A>>>,
  ): Result<Array<Ok<A>>, Err<A>>;
  export function consolidate(xs: ReadonlyArray<unknown>) {
    const firstErr = xs.find(isErr);
    return firstErr !== undefined ? firstErr : xs.filter(isOk);
  }

  /**
   * Create a version of a function which returns a `Result` instead of
   * throwing an error. If the optional `onThrow` argument is provided then the
   * function is called to transform the thrown value into an `Err`. If
   * `onThrow` is not provided then the thrown value is returned as-is if it's
   * already an `Error`, otherwise the value is interpolated into a generic
   * error message and data might be lost.
   */
  export function encase<Args extends Array<any>, A, E extends Error>(
    fn: (...args: Args) => A,
    onThrow: (e: unknown) => E,
  ): (...args: Args) => Result<Ok<A>, Err<A | E>>;
  export function encase<Args extends Array<any>, A>(
    fn: (...args: Args) => A,
  ): (...args: Args) => Result<Ok<A>, Err<A> | Error>;
  export function encase<Args extends Array<any>, A, E extends Error>(
    fn: (...args: Args) => A,
    onThrow?: (e: unknown) => E,
  ) {
    return (...args: Args) => {
      try {
        return fn(...args);
      } catch (e: unknown) {
        if (onThrow) {
          return onThrow(e);
        } else if (isErr(e)) {
          return e;
        } else {
          return err(`caught thrown value ${e}`);
        }
      }
    };
  }

  /**
   * Create a version of a function which returns a `Result` instead of
   * throwing an error. If the optional `onThrow` argument is provided then the
   * function is called to transform the thrown value, and then the value is
   * wrapped in a `DataError` object. If `onThrow` is not provided then the
   * thrown value is simply wrapped in a `DataError`.
   */
  export function encaseWithData<Args extends Array<any>, A, B>(
    fn: (...args: Args) => A,
    onThrow: (e: unknown) => B,
  ): (...args: Args) => Result<Ok<A>, Err<A> | DataError<B>>;
  export function encaseWithData<Args extends Array<any>, A>(
    fn: (...args: Args) => A,
  ): (...args: Args) => Result<Ok<A>, Err<A> | DataError<unknown>>;
  export function encaseWithData<Args extends Array<any>, A, B>(
    fn: (...args: Args) => A,
    onThrow?: (e: unknown) => B,
  ) {
    return (...args: Args) => {
      try {
        return fn(...args);
      } catch (e: unknown) {
        if (onThrow) {
          return errData(onThrow(e));
        } else {
          return errData(e);
        }
      }
    };
  }

  /**
   * Given a promise, return a promise which will always fulfill. If the
   * optional `onReject` argument is provided then the function is called to
   * transform the rejected value into an `Err`. If `onReject` is not provided
   * then the rejected value is returned as-is if it's already an `Error`,
   * otherwise the value is interpolated into a generic error message and data
   * might be lost.
   */
  export async function encasePromise<A, E extends Error>(
    p: PromiseLike<A>,
    onReject: (e: unknown) => E,
  ): Promise<Result<Ok<A>, Err<A | E>>>;
  export async function encasePromise<A>(
    p: PromiseLike<A>,
  ): Promise<Result<Ok<A>, Err<A> | Error>>;
  export async function encasePromise<A, E extends Error>(
    p: PromiseLike<A>,
    onReject?: (e: unknown) => E,
  ) {
    try {
      return await p;
    } catch (e) {
      if (onReject) {
        return onReject(e);
      } else if (isErr(e)) {
        return e;
      } else {
        return err(`caught rejected value ${e}`);
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
  ): Promise<Result<Ok<A>, Err<A> | DataError<B>>>;
  export async function encasePromiseWithData<A>(
    p: PromiseLike<A>,
  ): Promise<Result<Ok<A>, Err<A> | DataError<unknown>>>;
  export async function encasePromiseWithData<A, B>(
    p: PromiseLike<A>,
    onReject?: (e: unknown) => B,
  ) {
    try {
      return await p;
    } catch (e) {
      if (onReject) {
        return errData(onReject(e));
      } else {
        return errData(e);
      }
    }
  }
}
