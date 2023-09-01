/**
 *
 * Type: The `Loading` variant of a `RemoteData` represents data that is being
 * retrieved.
 *
 */
export type Loading = symbol & { readonly IsLoading: unique symbol };

/**
 *
 * Namespace: The `Loading` namespace contains functions for `Loading` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Loading {
  /* Any type except Loading. */
  type ExcludeLoading<A> = Exclude<A, Loading>;

  /** A constructor for the `Loading` variant of `RemoteData`. */
  export const value: Loading = Symbol("Loading") as Loading;

  /** Typeguard for the `Loading` variant of a `RemoteData`. */
  export function isType(x: unknown): x is Loading {
    return x === value;
  }

  /**
   * Assert that `x` is `Loading`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export function coerce(x: unknown): Loading {
    if (isType(x)) return x;
    throw new Error("Expected the Loading symbol");
  }

  /** Call `fn` if `x` is `Loading`. Otherwise return the non-loading value. */
  export function ifType<A>(
    a: ExcludeLoading<A>,
    fn: () => any,
  ): ExcludeLoading<A>;
  export function ifType<A>(a: Loading, fn: () => A): A;
  export function ifType<A, B>(a: A, fn: () => B): ExcludeLoading<A> | B;
  export function ifType(a: unknown, fn: () => unknown) {
    return isType(a) ? fn() : a;
  }
}
