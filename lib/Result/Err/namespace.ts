import type { Result } from "../namespace";
import type { Ok } from "../Ok/namespace";
import { DataError } from "../../DataError/namespace";

/**
 *
 * Type: The `Err` variant of a `Result` represents a situation where the
 * computation has failed. It can be any object which inherits from the default
 * JavaScript `Error` class. Values of this type can be created like any normal
 * error object. The provided constructors can create vanilla `Error` objects
 * or `DataError<D>` objects with an additional `data` field containing error
 * data of type `D`.
 *
 */
export type Err<E> = Extract<E, Error>;

/**
 *
 * Namespace: The `Result.Err` namespace contains functions for `Err` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Err {
  /**
   * A constructor for the `Err` variant of `Result`, creates a vanilla `Error`
   * object.
   */
  export function of(message?: string): Error {
    return new Error(message);
  }

  /**
   * A constructor for the `Err` variant of `Result`, creates a `DataError`
   * object.
   */
  export function withData<D>(data: D, message?: string): DataError<D> {
    return DataError.of(data, message);
  }
  /** Typeguard for the `Err` variant of a `Result`. */
  export function isType<A>(x: A): x is Err<A> {
    return x instanceof Error;
  }

  /**
   * Assert that `x` is an `Err`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(x: A): Err<A> {
    if (isType(x)) return x;
    throw new Error("Expected an Error value, got Ok");
  }

  /**
   * Apply `fn` if `x` is an `Err`. Note that in order to change the error
   * value, `fn` will either have to mutate the object, or create a new
   * object.
   */
  export function ifType<A, B>(a: Ok<A>, fn: (e: Err<A>) => B): Ok<A>;
  export function ifType<A, B>(a: Err<A>, fn: (e: Err<A>) => B): B;
  export function ifType<A, B>(a: A, fn: (e: Err<A>) => Ok<B>): Ok<A | B>;
  export function ifType<A, B>(
    a: A,
    fn: (e: Err<A>) => B,
  ): Result<Ok<A | B>, Err<B>>;
  export function ifType(a: unknown, fn: (e: unknown) => unknown) {
    return isType(a) ? fn(a) : a;
  }
}
