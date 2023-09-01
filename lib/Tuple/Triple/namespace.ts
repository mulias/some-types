import { Option } from "../../Option/namespace";

/**
 *
 * Type: A `Triple` tuple is an array with three elements.
 *
 */
export type Triple<A, B, C> = readonly [A, B, C];

/**
 *
 * Namespace: The `Triple` namespace contains functions for `Triple` values
 * including constructors, type guards, and conversions to other data types.
 *
 */
export namespace Triple {
  /** A constructor for the `Triple` tuple, which has three elements. */
  export function of<A, B, C>(a: A, b: B, c: C): Triple<A, B, C> {
    return [a, b, c];
  }

  /** Typeguard for the `Triple` tuple. */
  export function isType<A, B, C>(
    a: readonly [A, B, ...C[]],
  ): a is Triple<A, B, C>;
  export function isType<A, B>(a: readonly [A, ...B[]]): a is Triple<A, B, B>;
  export function isType<A>(a: readonly A[]): a is Triple<A, A, A>;
  export function isType(a: unknown): a is Triple<unknown, unknown, unknown>;
  export function isType(a: any): a is Triple<any, any, any>;
  export function isType(a: unknown) {
    return Array.isArray(a) && a.length === 3;
  }

  /**
   * Return a shallow copy of `a` as a `Triple` if it's an array with three
   * elements, otherwise return `undefined`.
   */
  export function fromArray<A, B, C>(a: Triple<A, B, C>): Triple<A, B, C>;
  export function fromArray<A, B, C, D>(
    a: readonly [A, B, C, ...D[]],
  ): Option<Triple<A, B, C>>;
  export function fromArray<A>(a: readonly A[]): Option<Triple<A, A, A>>;
  export function fromArray(a: readonly unknown[]) {
    return a.length === 3 ? ([...a] as any) : undefined;
  }

  /**
   * Assert that `a` is a `Triple`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export function coerce<A, B, C>(a: Triple<A, B, C>): Triple<A, B, C>;
  export function coerce<A, B, C, D>(
    a: readonly [A, B, C, ...D[]],
  ): Triple<A, B, C>;
  export function coerce<A>(a: readonly A[]): Triple<A, A, A>;
  export function coerce(a: readonly unknown[]) {
    if (isType(a)) return [...a] as any;
    throw new Error("Expected an array of length 3");
  }
}
