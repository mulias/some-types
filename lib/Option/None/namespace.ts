import type { Option } from "../namespace";
import type { Some } from "../Some/namespace";

/**
 * Type: The `None` variant of a `Option` is `undefined`. This works best for
 * integrating with TypeScript features such as optional property notation,
 * since `propName?: Option<string>`, and `propName?: string` are equivalent
 * types. Values of this type can be constructed with the `None` constant, or
 * by using `undefined` directly.
 */
export type None = undefined;

/**
 * Namespace: The `Option.None` namespace contains functions for `None` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 */
export namespace None {
  /**
   * A constructor for the `None` variant of `Option`, which is an alias
   * for undefined.
   */
  export const value: None = undefined;

  /** Typeguard for the `None` variant of a `Option`. */
  export function isType(x: unknown): x is None {
    return x === undefined;
  }

  /**
   * Assert that `x` is `None`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export function coerce(x: unknown): None {
    if (isType(x)) return x;
    throw new Error("Expected None, got a Some value");
  }

  /** Call `fn` if `x` is `None`. Otherwise return `x`. */
  export function ifType<A>(x: None, fn: () => A): A;
  export function ifType<A, B>(x: Some<A>, fn: () => B): Some<A>;
  export function ifType<A, B>(x: Option<A>, fn: () => B): Some<A> | B;
  export function ifType<A, B>(x: Option<A>, fn: () => B) {
    return isType(x) ? fn() : x;
  }
}
