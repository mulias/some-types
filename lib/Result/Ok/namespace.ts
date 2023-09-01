import { Result } from "../namespace";
import { Err } from "../Err/namespace";

/**
 *
 * Type: The `Ok` variant of a `Result` is an alias for non-error values of
 * type `V`. The value can be of any concrete type that isn't an object
 * inheriting from `Error`.
 *
 */
export type Ok<V> = Exclude<V, Error>;

/**
 *
 * Namespace: The `Result.Ok` namespace contains functions for `Ok` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Ok {
  /** A constructor for the `Ok` variant of `Result`. */
  export function of<V>(v: Ok<V>): Ok<V> {
    return v;
  }

  /** Typeguard for the `Ok` variant of a `Result`. */
  export function isType<A>(x: A): x is Ok<A> {
    return !(x instanceof Error);
  }

  /**
   * Assert that `x` is an `Ok`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(x: A): Ok<A> {
    if (isType(x)) return x;
    throw new Error("Expected an Ok value, got Err");
  }

  /** Apply `fn` if `a` is an `Ok`. Otherwise return the `Err`. */
  export function ifType<A, B>(a: Err<A>, fn: (a: Ok<A>) => any): Err<A>;
  export function ifType<A, B>(a: Ok<A>, fn: (a: Ok<A>) => B): B;
  export function ifType<A, B>(a: A, fn: (a: Ok<A>) => Err<B>): Err<A | B>;
  export function ifType<A, B>(
    a: A,
    fn: (a: Ok<A>) => B,
  ): Result<Ok<B>, Err<A | B>>;
  export function ifType(a: unknown, fn: (a: unknown) => unknown) {
    return isType(a) ? fn(a) : a;
  }
}
