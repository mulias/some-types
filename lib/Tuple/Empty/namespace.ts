import { Option } from "../../Option/namespace";

/**
 *
 * Type: An `Empty` tuple is an array with no elements.
 *
 */
export type Empty = readonly [];

/**
 *
 * Namespace: The `Empty` namespace contains functions for `Empty` values
 * including constructors, type guards, and conversions to other data types.
 *
 */
export namespace Empty {
  /** A constructor for the `Empty` tuple, which has no elements. */
  export const value: Empty = [] as const;

  /** Typeguard for the `Empty` tuple. */
  export function isType(a: unknown): a is Empty {
    return Array.isArray(a) && a.length === 0;
  }

  /**
   * Return `Empty` if `a` is an empty array, otherwise return `undefined`.
   */
  export function fromArray(a: Empty): Empty;
  export function fromArray(a: readonly any[]): Option<Empty>;
  export function fromArray(a: readonly unknown[]) {
    return a.length === 0 ? ([] as any) : undefined;
  }

  /**
   * Assert that `a` is an `Empty`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export function coerce(a: readonly any[]): Empty {
    if (isType(a)) return [];
    throw new Error("Expected an array of length 0");
  }
}
