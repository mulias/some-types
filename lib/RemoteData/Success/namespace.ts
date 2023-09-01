import { NotAsked } from "../NotAsked/namespace";
import { Loading } from "../Loading/namespace";
import { Failure } from "../Failure/namespace";

/**
 *
 * Type: The `Success` variant of a `RemoteData` is an alias for retrieved data
 * of type `D`. The data can be of any concrete type that isn't an object
 * inheriting from `Error`, or the two constants `NotAsked` and `Loading`.
 *
 */
export type Success<D> = Exclude<D, NotAsked | Loading | Error>;

/**
 *
 * Namespace: The `Success` namespace contains functions for `Success` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Success {
  /* Any type except Success. */
  type ExcludeSuccess<T> = Extract<T, NotAsked | Loading | Error>;

  /** A constructor for the `Success` variant of `RemoteData`. */
  export function of<D>(d: Success<D>): Success<D> {
    return d;
  }
  /** Typeguard for the `Success` variant of a `RemoteData`. */
  export function isType<A>(x: A): x is Success<A> {
    return !NotAsked.isType(x) && !Loading.isType(x) && !Failure.isType(x);
  }

  /**
   * Assert that `x` is a `Success`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(x: A): Success<A> {
    if (NotAsked.isType(x)) {
      throw new Error("Expected a Success value, got NotAsked");
    } else if (Loading.isType(x)) {
      throw new Error("Expected a Success value, got Loading");
    } else if (Failure.isType(x)) {
      throw new Error("Expected a Success value, got Failure");
    } else {
      return x as any;
    }
  }

  /** Apply `fn` if `a` is a `Success`. Otherwise return the non-success value. */
  export function ifType<A>(
    a: ExcludeSuccess<A>,
    fn: (a: any) => any,
  ): ExcludeSuccess<A>;
  export function ifType<A, B>(a: Success<A>, fn: (a: Success<A>) => B): B;
  export function ifType<A, B>(
    a: A,
    fn: (a: Success<A>) => B,
  ): ExcludeSuccess<A> | B;
  export function ifType<A>(a: A, fn: (a: Success<A>) => unknown) {
    return isType(a) ? fn(a) : a;
  }
}
