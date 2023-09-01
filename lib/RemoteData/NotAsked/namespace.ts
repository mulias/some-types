/**
 *
 * Type: The `NotAsked` variant of a `RemoteData` represents data that is not
 * yet initialized.
 *
 */
export type NotAsked = symbol & { readonly IsNotAsked: unique symbol };

/**
 *
 * Namespace: The `NotAsked` namespace contains functions for `NotAsked` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace NotAsked {
  /* Any type except NotAsked. */
  type ExcludeNotAsked<A> = Exclude<A, NotAsked>;

  /** A constructor for the `NotAsked` variant of `RemoteData`. */
  export const value: NotAsked = Symbol("NotAsked") as NotAsked;

  /** Typeguard for the `NotAsked` variant of a `RemoteData`. */
  export function isType(x: unknown): x is NotAsked {
    return x === value;
  }

  /**
   * Assert that `x` is `NotAsked`. If the assertion holds then return `x` with
   * an updated type. If the assertion fails throw an error.
   */
  export function coerce(x: unknown): NotAsked {
    if (isType(x)) return x;
    throw new Error("Expected the NotAsked symbol");
  }

  /** Call `fn` if `x` is `NotAsked`. Otherwise return the value. */
  export function ifType<A>(
    a: ExcludeNotAsked<A>,
    fn: () => any,
  ): ExcludeNotAsked<A>;
  export function ifType<A>(a: NotAsked, fn: () => A): A;
  export function ifType<A, B>(a: A, fn: () => B): ExcludeNotAsked<A> | B;
  export function ifType(a: unknown, fn: () => unknown) {
    return isType(a) ? fn() : a;
  }
}
