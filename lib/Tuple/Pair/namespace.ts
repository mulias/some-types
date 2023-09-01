import { Option } from "../../Option/namespace";

/**
 *
 * Type: A `Pair` tuple is an array with two elements.
 *
 */
export type Pair<A, B> = readonly [A, B];

/**
 *
 * Namespace: The `Pair` namespace contains functions for `Pair` values
 * including constructors, type guards, and conversions to other data types.
 *
 */
export namespace Pair {
  /** A constructor for the `Pair` tuple, which has two elements. */
  export function of<A, B>(a: A, b: B): Pair<A, B> {
    return [a, b];
  }

  /** Typeguard for the `Pair` tuple. */
  export function isType<A, B>(a: readonly [A, ...B[]]): a is Pair<A, B>;
  export function isType<A>(a: readonly A[]): a is Pair<A, A>;
  export function isType(a: unknown): a is Pair<unknown, unknown>;
  export function isType(a: unknown) {
    return Array.isArray(a) && a.length === 2;
  }

  /**
   * Return a shallow copy of `a` as a `Pair` if it's an array with two elements,
   * otherwise return `undefined`.
   */
  export function fromArray<A, B>(a: Pair<A, B>): Pair<A, B>;
  export function fromArray<A, B, C>(
    a: readonly [A, B, ...C[]],
  ): Option<Pair<A, B>>;
  export function fromArray<A>(a: readonly A[]): Option<Pair<A, A>>;
  export function fromArray(a: readonly unknown[]) {
    return a.length === 2 ? ([...a] as any) : undefined;
  }

  /**
   * Assert that `a` is a `Pair`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export function coerce<A, B>(a: Pair<A, B>): Pair<A, B>;
  export function coerce<A, B, C>(a: readonly [A, B, ...C[]]): Pair<A, B>;
  export function coerce<A>(a: readonly A[]): Pair<A, A>;
  export function coerce(a: readonly unknown[]) {
    if (isType(a)) return [...a] as any;
    throw new Error("Expected an array of length 2");
  }
}
