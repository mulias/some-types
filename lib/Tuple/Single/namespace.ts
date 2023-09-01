import { Option } from "../../Option/namespace";

/**
 *
 * Type: A `Single` tuple is an array with one element.
 *
 */
export type Single<A> = readonly [A];

/**
 *
 * Namespace: The `Single` namespace contains functions for `Single` values
 * including constructors, type guards, and conversions to other data types.
 *
 */
export namespace Single {
  /** A constructor for the `Single` tuple, which has one element. */
  export function of<A>(a: A): Single<A> {
    return [a];
  }

  /** Typeguard for the `Single` tuple. */
  export function isType<A>(a: readonly A[]): a is Single<A>;
  export function isType(a: unknown): a is Single<unknown>;
  export function isType(a: unknown) {
    return Array.isArray(a) && a.length === 1;
  }

  /**
   * Return a shallow copy of `a` as a `Single` if it's an array with one
   * element, otherwise return `undefined`.
   */
  export function fromArray<A>(a: Single<A>): Single<A>;
  export function fromArray<A, B>(a: readonly [A, ...B[]]): Option<Single<A>>;
  export function fromArray<A>(a: readonly A[]): Option<Single<A>>;
  export function fromArray(a: readonly unknown[]) {
    return a.length === 1 ? ([...a] as any) : undefined;
  }

  /**
   * Assert that `a` is a `Single`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export function coerce<A>(a: Single<A>): Single<A>;
  export function coerce<A, B>(a: readonly [A, ...B[]]): Single<A>;
  export function coerce<A>(a: readonly A[]): Single<A>;
  export function coerce(a: readonly unknown[]) {
    if (isType(a)) return [...a] as any;
    throw new Error("Expected an array of length 1");
  }
}
