import { Option } from "../Option/namespace";

/**
 *
 * Type: A `NonEmptyArray<A>` is an immutable array where the elements have
 * type `A` and the array contains at least one element.
 *
 */
export type NonEmptyArray<A> = readonly [A, ...A[]];

/**
 *
 * Namespace: The `NonEmptyArray` namespace contains functions for
 * `NonEmptyArray` values including constructors, type guards, conversions to
 * other data types, and operations over the type.
 *
 */
export namespace NonEmptyArray {
  //
  // Constructors
  //

  /** Create a NonEmptyArray with a `first` value and an optional `rest` array. */
  export function nonEmptyArray<A>(first: A, rest: A[] = []): NonEmptyArray<A> {
    return [first, ...rest];
  }

  /** Create a NonEmptyArray with a `first` value and an optional `rest` array. */
  export const of = nonEmptyArray;

  //
  // Typeguards
  //

  /**
   * Typeguard for a `NonEmptyArray`.
   *
   * Note that typeguards can't cast from mutable to readonly types. This means
   * that if `a` has the type `number[]`, within the guard scape `a` will have
   * the type `number[] & NonEmptyArray<number>`. The compiler will be aware that
   * `a` is non-empty, but will also allow `a` to be mutated.
   */
  export function isNonEmptyArray<A>(
    a: ReadonlyArray<A>,
  ): a is NonEmptyArray<A>;
  export function isNonEmptyArray(a: unknown): a is NonEmptyArray<unknown>;
  export function isNonEmptyArray(a: unknown) {
    return Array.isArray(a) && a.length > 0;
  }

  /** Typeguard for a `NonEmptyArray`. */
  export const isType = isNonEmptyArray;

  //
  // Conversions
  //

  /**
   * Return a shallow copy of `a` as a `NonEmptyArray` if it's non-empty, or
   * return `Option.Nothing` if it's empty.
   */
  export function fromArray<A extends NonEmptyArray<any>>(a: A): A;
  export function fromArray<A>(a: readonly A[]): Option<NonEmptyArray<A>>;
  export function fromArray(a: readonly unknown[]) {
    const copy = [...a];
    return isNonEmptyArray(copy) ? copy : undefined;
  }

  /**
   * Assert that `a` is a `NonEmptyArray`. If the assertion holds then return a
   * shallow copy of `a` with an updated type. If the assertion fails throw an
   * error.
   */
  export function coerceNonEmptyArray<A>(
    a: ReadonlyArray<A>,
  ): NonEmptyArray<A> {
    if (isNonEmptyArray(a)) return [...a];
    throw new Error("Expected a NonEmptyArray");
  }

  /**
   * Assert that `a` is a `NonEmptyArray`. If the assertion holds then return a
   * shallow copy of `a` with an updated type. If the assertion fails throw an
   * error.
   */
  export const coerce = coerceNonEmptyArray;

  //
  // Operations
  //

  /** Get the first element in a `NonEmptyArray`. */
  export function first<A>([f]: NonEmptyArray<A>): A {
    return f;
  }

  /** Get the last element in a `NonEmptyArray`. */
  export function last<A>(a: NonEmptyArray<A>): A {
    return a[a.length - 1] as A;
  }

  /** Return a new, possibly empty, Array with all but the last element. */
  export function front<A>(a: NonEmptyArray<A>): readonly A[] {
    return a.slice(0, a.length - 1);
  }

  /** Return a new, possibly empty, Array with all but the first element. */
  export function tail<A>([_h, ...t]: NonEmptyArray<A>): readonly A[] {
    return t;
  }

  /**
   * Apply `fn` to each element in the `NonEmptyArray`. Unlike
   * `Array.prototype.map`, this function preserves the `NonEmptyArray` type,
   * instead of returning an `Array`.
   */
  export function map<A, B>(
    a: NonEmptyArray<A>,
    fn: (a: A, index?: number, array?: NonEmptyArray<A>) => B,
  ): NonEmptyArray<B> {
    return a.map(fn as any) as any;
  }

  /** Reverse the order of a `NonEmptyArray`, returning a shallow copy. */
  export function reverse<A>(a: NonEmptyArray<A>): NonEmptyArray<A> {
    return [...a].reverse() as any;
  }

  /** Concat two arrays, one of which must be a `NonEmptyArray`. */
  export function concat<A>(
    a1: NonEmptyArray<A>,
    a2: ReadonlyArray<A>,
  ): NonEmptyArray<A>;
  export function concat<A>(
    a1: ReadonlyArray<A>,
    a2: NonEmptyArray<A>,
  ): NonEmptyArray<A>;
  export function concat(
    a1: ReadonlyArray<unknown>,
    a2: ReadonlyArray<unknown>,
  ) {
    return [...a1, ...a2] as any;
  }

  /** Sort a `NonEmptyArray`, returning a shallow copy. */
  export function sort<A>(a: NonEmptyArray<A>): NonEmptyArray<A> {
    return [...a].sort() as any;
  }
}
