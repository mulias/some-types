import type { RemoteData } from "../namespace";
import { DataError } from "../../DataError/namespace";
import { Loading } from "../Loading/namespace";
import { NotAsked } from "../NotAsked/namespace";
import { Success } from "../Success/namespace";

/**
 *
 * Type: The `Failure` variant of a `RemoteData` represents a situation where
 * the data could not be retrieved. It can be any error object which inherits
 * from the default JavaScript `Error` class. Values of this type can be
 * created like any normal error object. The provided constructors can create
 * vanilla `Error` objects or `DataError<D>` objects with an additional `data`
 * field containing error data of type `D`.
 *
 */
export type Failure<E> = Extract<E, Error>;

/**
 *
 * Namespace: The `Failure` namespace contains functions for `Failure` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Failure {
  /* Any type except Success. */
  type ExcludeFailure<T> = Exclude<T, Error>;

  /**
   * A constructor for the `Failure` variant of `RemoteData`, creates a vanilla
   * `Error` object.
   */
  export function of(message?: string): Failure<Error> {
    return new Error(message);
  }

  /**
   * A constructor for the `Failure` variant of `RemoteData`, creates a
   * `DataError` object.
   */
  export function withData<D>(
    data: D,
    message?: string,
  ): Failure<DataError<D>> {
    return DataError.of(data, message);
  }

  /** Typeguard for the `Failure` variant of a `RemoteData`. */
  export function isType<A>(x: A): x is Failure<A> {
    return x instanceof Error;
  }

  /**
   * Assert that `x` is a `Failure`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(x: A): Failure<A> {
    if (NotAsked.isType(x)) {
      throw new Error("Expected a Failure value, got NotAsked");
    } else if (Loading.isType(x)) {
      throw new Error("Expected a Failure value, got Loading");
    } else if (Success.isType(x)) {
      throw new Error("Expected a Failure value, got Success");
    } else {
      return x as any;
    }
  }

  /** Apply `fn` if `x` is a `Failure`. Otherwise return the non-failure value. */
  export function ifType<A, B, E extends Error>(
    a: ExcludeFailure<A>,
    fn: (e: E) => B,
  ): ExcludeFailure<A>;
  export function ifType<A, B>(a: Failure<A>, fn: (e: Failure<A>) => B): B;
  export function ifType<A, B>(
    a: A,
    fn: (e: Failure<A>) => B,
  ): ExcludeFailure<A> | B;
  export function ifType<A, B>(a: A, fn: (e: Failure<A>) => B) {
    return isType(a) ? fn(a) : a;
  }
}
