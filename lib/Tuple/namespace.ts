import { Empty, Empty as EmptyImpl } from "./Empty/namespace";
import { Option } from "../Option/namespace";
import { NonEmptyArray } from "../NonEmptyArray/namespace";
import { Pair, Pair as PairImpl } from "./Pair/namespace";
import { Single, Single as SingleImpl } from "./Single/namespace";
import { Triple, Triple as TripleImpl } from "./Triple/namespace";
import { IsNever } from "../type_util";

/**
 *
 * Type: A `Tuple<A, B, C>` is an immutable array with a fixed length. For
 * simplicity we provide utilities for tuples of length 0, 1, 2, and 3,
 * although TypeScript has support for larger tuples. These tuple variants are
 * called `Empty`, `Single<A>`, `Pair<A, B>`, and `Triple<A, B, C>`. The
 * `Tuple` type is variadic and will return the appropriate type when given 0
 * to 3 type parameters.
 *
 */
export type Tuple<A = never, B = never, C = never> = IsNever<C> extends 0
  ? Triple<A, B, C>
  : IsNever<B> extends 0
  ? Pair<A, B>
  : IsNever<A> extends 0
  ? Single<A>
  : Empty;

export declare namespace Tuple {
  export { Empty, Single, Pair, Triple };
}

/**
 *
 * Namespace: The `Tuple` namespace contains functions for `Tuple`
 * values including constructors, type guards, conversions to other data types,
 * and operations over the type.
 *
 */
export namespace Tuple {
  //
  // Namespaces
  //

  Tuple.Empty = EmptyImpl;
  Tuple.Single = SingleImpl;
  Tuple.Pair = PairImpl;
  Tuple.Triple = TripleImpl;

  //
  // Types
  //

  /** An array with no elements, also called a 0-tuple. */
  type Empty = Tuple.Empty;

  /** An array with one element, also called a 1-tuple. */
  type Single<A> = Tuple.Single<A>;

  /** An array with two elements, also called a 2-tuple. */
  type Pair<A, B> = Tuple.Pair<A, B>;

  /** An array with three elements, also called a 3-tuple. */
  type Triple<A, B, C> = Tuple.Triple<A, B, C>;

  //
  // Constructors
  //

  /** Create a `Tuple` from the zero to three provided arguments. */
  export function tuple(): Empty;
  export function tuple<A>(a: A): Single<A>;
  export function tuple<A, B>(a: A, b: B): Pair<A, B>;
  export function tuple<A, B, C>(a: A, b: B, c: C): Triple<A, B, C>;
  export function tuple<Args extends Tuple<any, any, any>>(...args: Args) {
    return args;
  }

  /** A constructor for the `Empty` tuple, which has no elements. */
  export const empty = Empty.value;

  /** A constructor for the `Single` tuple, which has one element. */
  export const single = Single.of;

  /** A constructor for the `Pair` tuple, which has two elements. */
  export const pair = Pair.of;

  /** A constructor for the `Triple` tuple, which has three elements. */
  export const triple = Triple.of;

  /** Create a `Tuple` from the zero to three provided arguments. */
  export const of = tuple;

  //
  // Typeguards
  //

  /* Typeguard for a 0/1/2/3 element tuple. */
  export function isTuple<A, B, C, D>(
    a: readonly [A, B, C, ...D[]],
  ): a is Triple<A, B, C>;
  export function isTuple<A, B, C>(
    a: readonly [A, B, ...C[]],
  ): a is Pair<A, B> | Triple<A, B, C>;
  export function isTuple<A, B>(
    a: readonly [A, ...B[]],
  ): a is Single<A> | Pair<A, B> | Triple<A, B, B>;
  export function isTuple<A>(
    a: readonly A[],
  ): a is Empty | Single<A> | Pair<A, A> | Triple<A, A, A>;
  export function isTuple(
    a: unknown,
  ): a is
    | Empty
    | Single<unknown>
    | Pair<unknown, unknown>
    | Triple<unknown, unknown, unknown>;
  export function isTuple(a: unknown) {
    return (
      Array.isArray(a) &&
      (a.length === 0 || a.length === 1 || a.length === 2 || a.length === 3)
    );
  }

  /** Typeguard for the `Empty` tuple. */
  export const isEmpty = Empty.isType;

  /** Typeguard for the `Single` tuple. */
  export const isSingle = Single.isType;

  /** Typeguard for the `Pair` tuple. */
  export const isPair = Pair.isType;

  /** Typeguard for the `Triple` tuple. */
  export const isTriple = Triple.isType;

  /* Typeguard for a 0/1/2/3 element tuple. */
  export const isType = isTuple;

  //
  // Conversions
  //

  /**
   * Return a shallow copy of `a` as a `Tuple` if it's an array of length 3 or
   * less, otherwise return `undefined`.
   */
  export function fromArray(a: Empty): Empty;
  export function fromArray<A>(a: Single<A>): Single<A>;
  export function fromArray<A, B>(a: Pair<A, B>): Pair<A, B>;
  export function fromArray<A, B, C>(a: Triple<A, B, C>): Triple<A, B, C>;
  export function fromArray<A, B, C, D>(
    a: readonly [A, B, C, ...D[]],
  ): Option<Triple<A, B, C>>;
  export function fromArray<A, B, C>(
    a: readonly [A, B, ...C[]],
  ): Option<Pair<A, B> | Triple<A, B, C>>;
  export function fromArray<A, B>(
    a: readonly [A, ...B[]],
  ): Option<Single<A> | Pair<A, B> | Triple<A, B, B>>;
  export function fromArray<A>(
    a: readonly A[],
  ): Option<Empty | Single<A> | Pair<A, A> | Triple<A, A, A>>;
  export function fromArray(a: readonly unknown[]) {
    return a.length <= 3 ? ([...a] as any) : undefined;
  }

  /**
   * Return `Empty` if `a` is an empty array, otherwise return `undefined`.
   */
  export const fromEmptyArray = Empty.fromArray;

  /**
   * Return a shallow copy of `a` as a `Single` if it's an array with one
   * element, otherwise return `undefined`.
   */
  export const fromSingleArray = Single.fromArray;

  /**
   * Return a shallow copy of `a` as a `Pair` if it's an array with two elements,
   * otherwise return `undefined`.
   */
  export const fromPairArray = Pair.fromArray;

  /**
   * Return a shallow copy of `a` as a `Triple` if it's an array with three
   * elements, otherwise return `undefined`.
   */
  export const fromTripleArray = Triple.fromArray;

  /**
   * Assert that `a` is a `Tuple`.  If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export function coerceTuple<A, B, C, D>(
    a: readonly [A, B, C, ...D[]],
  ): Triple<A, B, C>;
  export function coerceTuple<A, B, C>(
    a: readonly [A, B, ...C[]],
  ): Pair<A, B> | Triple<A, B, C>;
  export function coerceTuple<A, B>(
    a: readonly [A, ...B[]],
  ): Single<A> | Pair<A, B> | Triple<A, B, B>;
  export function coerceTuple<A>(
    a: readonly A[],
  ): Empty | Single<A> | Pair<A, A> | Triple<A, A, A>;
  export function coerceTuple(a: readonly unknown[]) {
    if (isTuple(a)) return [...a] as any;
    throw new Error("Expected an array of length 0, 1, 2, or 3");
  }

  /**
   * Assert that `a` is an `Empty`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export const coerceEmpty = Empty.coerce;

  /**
   * Assert that `a` is a `Single`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export const coerceSingle = Single.coerce;

  /**
   * Assert that `a` is a `Pair`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export const coercePair = Pair.coerce;

  /**
   * Assert that `a` is a `Triple`. If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export const coerceTriple = Triple.coerce;

  /**
   * Assert that `a` is a `Tuple`.  If the assertion holds then return a shallow
   * copy of `a` with an updated type. If the assertion fails throw an error.
   */
  export const coerce = coerceTuple;

  //
  // Operations
  //

  /** Get the first element from a 1/2/3-tuple. */
  export function first<A>(
    t: Single<A> | Pair<A, any> | Triple<A, any, any>,
  ): A {
    return t[0];
  }

  /** Get the second element from a 2/3-tuple. */
  export function second<B>(t: Pair<any, B> | Triple<any, B, any>): B {
    return t[1];
  }

  /** Get the third element from a 3-tuple. */
  export function third<C>(t: Triple<any, any, C>): C {
    return t[2];
  }

  /** Get the first element from a 1/2/3-tuple. */
  export const head = first;

  /** Create a tuple with all the elements of `t` except the first one. */
  export function tail(t: Single<any>): Empty;
  export function tail<B>(t: Pair<any, B>): Single<B>;
  export function tail<B, C>(t: Triple<any, B, C>): Pair<B, C>;
  export function tail([_h, ...t]: ReadonlyArray<any>): ReadonlyArray<any> {
    return t;
  }

  /** Get the last element from a 1/2/3-tuple. */
  export function last<A>(
    t: Single<A> | Pair<any, A> | Triple<any, any, A>,
  ): A {
    return t[t.length - 1];
  }

  /** Create a tuple with all the elements of `t` except the last one. */
  export function front(t: Single<any>): Empty;
  export function front<A>(t: Pair<A, any>): Single<A>;
  export function front<A, B>(t: Triple<A, B, any>): Pair<A, B>;
  export function front(t: ReadonlyArray<any>) {
    return t.slice(0, t.length - 1) as any;
  }

  /**
   * Apply `fn` to each element in the `Tuple`. Unlike `Array.prototype.map`,
   * this function preserves the tuple length, instead of returning an `Array`.
   */
  export function map(
    t: Empty,
    fn: (value: never, index: never, tup: Empty) => any,
  ): Empty;
  export function map<A, D>(
    t: Single<A>,
    fn: (value: A, index: 0, tup: Single<A>) => D,
  ): Single<D>;
  export function map<A, B, D>(
    t: Pair<A, B>,
    fn: (value: A | B, index: 0 | 1, tup: Pair<A, B>) => D,
  ): Pair<D, D>;
  export function map<A, B, C, D>(
    t: Triple<A, B, C>,
    fn: (value: A | B | C, index: 0 | 1 | 2, tup: Triple<A, B, C>) => D,
  ): Triple<D, D, D>;
  export function map(t: any, fn: any) {
    return t.map(fn);
  }

  /**
   * Apply `fn` to the first element in a 1/2/3-tuple, producing a new `Tuple`
   * with any other element unchanged.
   */
  export function mapFirst<A, R>(t: Single<A>, fn: (a: A) => R): Single<R>;
  export function mapFirst<A, B, R>(t: Pair<A, B>, fn: (a: A) => R): Pair<R, B>;
  export function mapFirst<A, B, C, R>(
    t: Triple<A, B, C>,
    fn: (a: A) => R,
  ): Triple<R, B, C>;
  export function mapFirst<A>(
    [a, ...rest]: Single<A> | Pair<A, unknown> | Triple<A, unknown, unknown>,
    fn: (a: A) => any,
  ) {
    return [fn(a), ...rest] as any;
  }

  /**
   * Apply `fn` to the second element in a 2/3-tuple, producing a new `Tuple` with
   * the other elements unchanged;
   */
  export function mapSecond<A, B, R>(
    t: Pair<A, B>,
    fn: (b: B) => R,
  ): Pair<A, R>;
  export function mapSecond<A, B, C, R>(
    t: Triple<A, B, C>,
    fn: (b: B) => R,
  ): Triple<A, R, C>;
  export function mapSecond<B>(
    [a, b, ...rest]: Pair<unknown, B> | Triple<unknown, B, unknown>,
    fn: (b: B) => any,
  ) {
    return [a, fn(b), ...rest] as any;
  }

  /**
   * Apply `fn` to the third element in a 3-tuple, producing a new `Tuple` with
   * the other elements unchanged;
   */
  export function mapThird<A, B, C, R>(
    [a, b, c]: Triple<A, B, C>,
    fn: (c: C) => R,
  ): Triple<A, B, R> {
    return [a, b, fn(c)];
  }

  /** Reverse the order of a `Tuple`, returning a shallow copy. */
  export function reverse(t: Empty): Empty;
  export function reverse<A>(t: Single<A>): Single<A>;
  export function reverse<A, B>(t: Pair<A, B>): Pair<B, A>;
  export function reverse<A, B, C>(t: Triple<A, B, C>): Triple<C, B, A>;
  export function reverse(t: readonly unknown[]) {
    return [...t].reverse() as any;
  }

  /**
   * Create an array of tuples from zero to three input arrays. The resulting
   * array will be the length of the shortest input array, and additional
   * elements will be ignored. When the input is thought of as a 2D matrix this
   * is a (0/1/2/3 x N) to (N x 0/1/2/3) transpose.
   */
  export function zip(): Empty;
  export function zip<A>(a: NonEmptyArray<A>): NonEmptyArray<Single<A>>;
  export function zip<A>(a: ReadonlyArray<A>): Array<Single<A>>;
  export function zip<A, B>(
    a: NonEmptyArray<A>,
    b: NonEmptyArray<B>,
  ): NonEmptyArray<Pair<A, B>>;
  export function zip<A, B>(
    a: ReadonlyArray<A>,
    b: ReadonlyArray<B>,
  ): Array<Pair<A, B>>;
  export function zip<A, B, C>(
    a: NonEmptyArray<A>,
    b: NonEmptyArray<B>,
    c: NonEmptyArray<C>,
  ): NonEmptyArray<Triple<A, B, C>>;
  export function zip<A, B, C>(
    a: ReadonlyArray<A>,
    b: ReadonlyArray<B>,
    c: ReadonlyArray<C>,
  ): Array<Triple<A, B, C>>;
  export function zip(
    a?: ReadonlyArray<unknown>,
    b?: ReadonlyArray<unknown>,
    c?: ReadonlyArray<unknown>,
  ) {
    const res = [];

    if (a && b && c) {
      const len = Math.min(a.length, b.length, c.length);
      for (let i = 0; i < len; i++) {
        res[i] = [a[i], b[i], c[i]];
      }
    } else if (a && b) {
      const len = Math.min(a.length, b.length);
      for (let i = 0; i < len; i++) {
        res[i] = [a[i], b[i]];
      }
    } else if (a) {
      const len = a.length;
      for (let i = 0; i < len; i++) {
        res[i] = [a[i]];
      }
    }

    return res as any;
  }

  /**
   * Create a tuple of arrays from an array of tuples. When the input is thought
   * of as a 2D matrix this is an (N x 0/1/2/3) to (0/1/2/3 x N) transpose.
   */
  export function unzip(zipped: ReadonlyArray<Empty>): Empty;
  export function unzip<A>(
    zipped: NonEmptyArray<Single<A>>,
  ): Single<NonEmptyArray<A>>;
  export function unzip<A>(zipped: ReadonlyArray<Single<A>>): Single<A[]>;
  export function unzip<A, B>(
    zipped: NonEmptyArray<Pair<A, B>>,
  ): Pair<NonEmptyArray<A>, NonEmptyArray<B>>;
  export function unzip<A, B>(
    zipped: ReadonlyArray<Pair<A, B>>,
  ): Pair<A[], B[]>;
  export function unzip<A, B, C>(
    zipped: NonEmptyArray<Triple<A, B, C>>,
  ): Triple<NonEmptyArray<A>, NonEmptyArray<B>, NonEmptyArray<C>>;
  export function unzip<A, B, C>(
    zipped: ReadonlyArray<Triple<A, B, C>>,
  ): Triple<A[], B[], C[]>;
  export function unzip(
    tuples:
      | ReadonlyArray<Empty>
      | ReadonlyArray<Single<unknown>>
      | ReadonlyArray<Pair<unknown, unknown>>
      | ReadonlyArray<Triple<unknown, unknown, unknown>>,
  ) {
    if (tuples[0] === undefined) {
      return [];
    }

    const [firstTuple, ...rest] = tuples;

    const resTups = firstTuple.map((x) => [x]);

    rest.forEach((nextTup) =>
      resTups.forEach((resElem, resElemIndex) => {
        resElem.push(nextTup[resElemIndex]);
      }),
    );

    return resTups as any;
  }
}
