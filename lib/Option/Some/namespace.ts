import type { Option } from "../namespace";
import type { None } from "../None/namespace";

/**
 * Type: The `Some<A>` variant of a `Option` can be any type that isn't
 * `undefined`.
 */
export type Some<A> = Exclude<A, undefined>;

/**
 * Namespace: The `Option.Some` namespace contains functions for `Some` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 */
export namespace Some {
  /**
   * A constructor for the `Some` variant of `Option`. It accepts any value `a`
   * except for `undefined`.
   */
  export function of<A>(a: Some<A>): Some<A> {
    return a;
  }

  /** Typeguard for the `Some` variant of a `Option`. */
  export function isType<A>(x: A): x is Some<A> {
    return x !== undefined;
  }

  /**
   * Assert that `x` is a `Some`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(x: A): Some<A> {
    if (isType(x)) return x;
    throw new Error("Expected a Some value, got None");
  }

  /** Apply `fn` if `x` is a `Some`. Otherwise return `None`. */
  export function ifType<A, B>(x: None, fn: (x: Some<A>) => B): None;
  export function ifType<A, B>(x: Some<A>, fn: (x: Some<A>) => B): B;
  export function ifType<A, B>(x: A, fn: (x: Some<A>) => B): Option<B>;
  export function ifType<A, B>(x: Option<A>, fn: (x: Some<A>) => B) {
    return isType(x) ? fn(x) : undefined;
  }
}
