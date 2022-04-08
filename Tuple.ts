import * as Maybe from "./Maybe";
import * as NonEmptyArray from "./NonEmptyArray";

export {
  // Types
  Tuple,
  Empty,
  Single,
  Pair,
  Triple,
  T,
  // Constructors
  tuple,
  empty,
  single,
  pair,
  triple,
  of,
  // Typeguards
  isTuple,
  isEmpty,
  isSingle,
  isPair,
  isTriple,
  // Conversions
  fromArray,
  fromEmptyArray,
  fromSingleArray,
  fromPairArray,
  fromTripleArray,
  // Operations
  first,
  second,
  third,
  head,
  tail,
  last,
  front,
  map,
  mapFirst,
  mapSecond,
  mapThird,
  reverse,
  zip,
  unzip
};

//
// Types
//

/**
 * A `Tuple` is an immutable `Array` with a fixed length. For simplicity we
 * provide utilities for tuples of length 0, 1, 2, and 3, although TypeScript
 * has basic support for larger tuples.
 */
type Tuple<A, B, C> = Empty | Single<A> | Pair<A, B> | Triple<A, B, C>;

/** Alias for the `Tuple` type. */
type T<A, B, C> = Tuple<A, B, C>;

/** An array with no elements, also called a 0-tuple. */
type Empty = readonly [];

/** An array with one element, also called a 1-tuple. */
type Single<A> = readonly [A];

/** An array with two elements, also called a 2-tuple. */
type Pair<A, B> = readonly [A, B];

/** An array with three elements, also called a 3-tuple. */
type Triple<A, B, C> = readonly [A, B, C];

//
// Constructors
//

/** Create a `Tuple` from the zero to three provided arguments. */
function tuple(): Empty;
function tuple<A>(a: A): Single<A>;
function tuple<A, B>(a: A, b: B): Pair<A, B>;
function tuple<A, B, C>(a: A, b: B, c: C): Triple<A, B, C>;
function tuple<Args extends Tuple<any, any, any>>(...args: Args) {
  return args;
}

/** A constructor for the `Empty` tuple, which has no elements. */
const empty: Empty = [] as const;

/** A constructor for the `Single` tuple, which has one element. */
function single<A>(a: A): Single<A> {
  return [a];
}

/** A constructor for the `Pair` tuple, which has two elements. */
function pair<A, B>(a: A, b: B): Pair<A, B> {
  return [a, b];
}

/** A constructor for the `Triple` tuple, which has three elements. */
function triple<A, B, C>(a: A, b: B, c: C): Triple<A, B, C> {
  return [a, b, c];
}

/** Alias for the `tuple` constructor. */
const of = tuple;

//
// Typeguards
//

/** Typeguard for the `Tuple` type. */
function isTuple<A, B, C>(arr: Tuple<A, B, C>): arr is Tuple<A, B, C>;
function isTuple<A>(arr: readonly A[]): arr is Tuple<A, A, A>;
function isTuple(arr: unknown): arr is Tuple<unknown, unknown, unknown>;
function isTuple(arr: unknown) {
  return Array.isArray(arr) && arr.length === 0;
}

/** Typeguard for the `Empty` tuple. */
function isEmpty(arr: unknown): arr is Empty {
  return Array.isArray(arr) && arr.length === 0;
}

/** Typeguard for the `Single` tuple. */
function isSingle<A>(arr: readonly A[]): arr is Single<A>;
function isSingle(arr: unknown): arr is Single<unknown>;
function isSingle(arr: unknown) {
  return Array.isArray(arr) && arr.length === 1;
}

/** Typeguard for the `Pair` tuple. */
function isPair<Tup extends Pair<any, any>>(arr: Tup): arr is Tup;
function isPair<A>(arr: readonly A[]): arr is Pair<A, A>;
function isPair(arr: unknown): arr is Pair<unknown, unknown>;
function isPair(arr: unknown) {
  return Array.isArray(arr) && arr.length === 2;
}

/** Typeguard for the `Triple` tuple. */
function isTriple<Tup extends Triple<any, any, any>>(arr: Tup): arr is Tup;
function isTriple<A>(arr: readonly A[]): arr is Triple<A, A, A>;
function isTriple(arr: unknown): arr is Triple<unknown, unknown, unknown>;
function isTriple(arr: unknown) {
  return Array.isArray(arr) && arr.length === 3;
}

//
// Conversions
//

/**
 * Return `a` as a `Tuple` if it's an array of length 3 or less, otherwise
 * return `Maybe.Nothing`.
 */
function fromArray(a: Empty): Empty;
function fromArray<A>(a: Single<A>): Single<A>;
function fromArray<A, B>(a: Pair<A, B>): Pair<A, B>;
function fromArray<A, B, C>(a: Triple<A, B, C>): Triple<A, B, C>;
function fromArray<A, B, C, D>(a: readonly [A, B, C, ...D[]]): Maybe.T<Triple<A, B, C>>;
function fromArray<A>(a: readonly A[]): Maybe.T<Tuple<A, A, A>>;
function fromArray(a: readonly unknown[]) {
  return a.length <= 3 ? a : undefined;
}

/**
 * Return `a` as `Empty` if it's an empty array, otherwise return
 * `Maybe.Nothing`.
 */
function fromEmptyArray(a: Empty): Empty;
function fromEmptyArray(a: readonly any[]): Maybe.T<Empty>;
function fromEmptyArray(a: readonly unknown[]) {
  return a.length === 0 ? a : undefined;
}

/**
 * Return `a` as a `Single` if it's an array with one element, otherwise return
 * `Maybe.Nothing`.
 */
function fromSingleArray<A>(a: Single<A>): Single<A>;
function fromSingleArray<A, B>(a: readonly [A, ...B[]]): Maybe.T<Single<A>>;
function fromSingleArray<A>(a: readonly A[]): Maybe.T<Single<A>>;
function fromSingleArray(a: readonly unknown[]) {
  return a.length === 1 ? a : undefined;
}

/**
 * Return `a` as a `Pair` if it's an array with two elements, otherwise return
 * `Maybe.Nothing`.
 */
function fromPairArray<A, B>(a: Pair<A, B>): Pair<A, B>;
function fromPairArray<A, B, C>(a: readonly [A, B, ...C[]]): Maybe.T<Pair<A, B>>;
function fromPairArray<A>(a: readonly A[]): Maybe.T<Pair<A, A>>;
function fromPairArray(a: readonly unknown[]) {
  return a.length === 2 ? a : undefined;
}

/**
 * Return `a` as a `Triple` if it's an array with three elements, otherwise
 * return `Maybe.Nothing`.
 */
function fromTripleArray<A, B, C>(a: Triple<A, B, C>): Triple<A, B, C>;
function fromTripleArray<A, B, C, D>(a: readonly [A, B, C, ...D[]]): Maybe.T<Triple<A, B, C>>;
function fromTripleArray<A>(a: readonly A[]): Maybe.T<Triple<A, A, A>>;
function fromTripleArray(a: readonly unknown[]) {
  return a.length === 3 ? a : undefined;
}

//
// Operations
//

/** Get the first element from a 1/2/3-tuple. */
function first<A>(t: Single<A> | Pair<A, any> | Triple<A, any, any>): A {
  return t[0];
}

/** Get the second element from a 2/3-tuple. */
function second<B>(t: Pair<any, B> | Triple<any, B, any>): B {
  return t[1];
}

/** Get the third element from a 3-tuple. */
function third<C>(t: Triple<any, any, C>): C {
  return t[2];
}

/** Get the first element from a 1/2/3-tuple. */
const head = first;

/** Create a tuple with all the elements of `t` except the first one. */
function tail(t: Single<any>): Empty;
function tail<B>(t: Pair<any, B>): Single<B>;
function tail<B, C>(t: Triple<any, B, C>): Pair<B, C>;
function tail([_h, ...t]: ReadonlyArray<any>): ReadonlyArray<any> {
  return t;
}

/** Get the last element from a 1/2/3-tuple. */
function last<A>(t: Single<A> | Pair<any, A> | Triple<any, any, A>): A {
  return t[t.length - 1];
}

/** Create a tuple with all the elements of `t` except the last one. */
function front(t: Single<any>): Empty;
function front<A>(t: Pair<A, any>): Single<A>;
function front<A, B>(t: Triple<A, B, any>): Pair<A, B>;
function front(t: Single<any> | Pair<any, any> | Triple<any, any, any>) {
  return t.slice(0, t.length - 1) as any;
}

/**
 * Apply `fn` to each element in the `Tuple`. Unlike `Array.prototype.map`,
 * this function preserves the tuple length, instead of returning an `Array`.
 */
function map(t: Empty, fn: (value: never, index: never, tup: Empty) => any): Empty;
function map<A, D>(t: Single<A>, fn: (value: A, index: 0, tup: Single<A>) => D): Single<D>;
function map<A, B, D>(
  t: Pair<A, B>,
  fn: (value: A | B, index: 0 | 1, tup: Pair<A, B>) => D
): Pair<D, D>;
function map<A, B, C, D>(
  t: Triple<A, B, C>,
  fn: (value: A | B | C, index: 0 | 1 | 2, tup: Triple<A, B, C>) => D
): Triple<D, D, D>;
function map(t: any, fn: any) {
  return t.map(fn);
}

/**
 * Apply `fn` to the first element in a 1/2/3-tuple, producing a new `Tuple`
 * with any other element unchanged.
 */
function mapFirst<A, R>(t: Single<A>, fn: (a: A) => R): Single<R>;
function mapFirst<A, B, R>(t: Pair<A, B>, fn: (a: A) => R): Pair<R, B>;
function mapFirst<A, B, C, R>(t: Triple<A, B, C>, fn: (a: A) => R): Triple<R, B, C>;
function mapFirst<A, Tup extends Single<A> | Pair<A, any> | Triple<A, any, any>>(
  [a, ...rest]: Tup,
  fn: (a: A) => any
) {
  return [fn(a), ...rest] as any;
}

/**
 * Apply `fn` to the second element in a 2/3-tuple, producing a new `Tuple` with
 * the other elements unchanged;
 */
function mapSecond<A, B, R>(t: Pair<A, B>, fn: (b: B) => R): Pair<A, R>;
function mapSecond<A, B, C, R>(t: Triple<A, B, C>, fn: (b: B) => R): Triple<A, R, C>;
function mapSecond<B, Tup extends Pair<any, B> | Triple<any, B, any>>(
  [a, b, ...rest]: Tup,
  fn: (b: B) => any
) {
  return [a, fn(b), ...rest] as any;
}

/**
 * Apply `fn` to the third element in a 3-tuple, producing a new `Tuple` with
 * the other elements unchanged;
 */
function mapThird<A, B, C, R>([a, b, c]: Triple<A, B, C>, fn: (c: C) => R): Triple<A, B, R> {
  return [a, b, fn(c)];
}

/** Reverse the order of a `Tuple`, returning a shallow copy. */
function reverse(t: Empty): Empty;
function reverse<A>(t: Single<A>): Single<A>;
function reverse<A, B>(t: Pair<A, B>): Pair<B, A>;
function reverse<A, B, C>(t: Triple<A, B, C>): Triple<C, B, A>;
function reverse<Tup extends any[]>(t: Tup) {
  return [...t].reverse() as any;
}

/**
 * Create an array of tuples from a tuple of arrays. The resulting array will
 * be the length of the shortest input array, and additional elements will be
 * ignored. When the input is thought of as a 2D matrix this is a (0/1/2/3 x N)
 * to (N x 0/1/2/3) transpose.
 */
function zip(t: Empty): Empty;
function zip<A>(t: Single<NonEmptyArray.T<A>>): NonEmptyArray.T<Single<A>>;
function zip<A>(t: Single<ReadonlyArray<A>>): Array<Single<A>>;
function zip<A, B>(t: Pair<NonEmptyArray.T<A>, NonEmptyArray.T<B>>): NonEmptyArray.T<Pair<A, B>>;
function zip<A, B>(t: Pair<ReadonlyArray<A>, ReadonlyArray<B>>): Array<Pair<A, B>>;
function zip<A, B, C>(
  t: Triple<NonEmptyArray.T<A>, NonEmptyArray.T<B>, NonEmptyArray.T<C>>
): NonEmptyArray.T<Triple<A, B, C>>;
function zip<A, B, C>(
  t: Triple<ReadonlyArray<A>, ReadonlyArray<B>, ReadonlyArray<C>>
): Array<Triple<A, B, C>>;
function zip(t: Tuple<ReadonlyArray<unknown>, ReadonlyArray<unknown>, ReadonlyArray<unknown>>) {
  const [a, b, c] = t;
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
function unzip(zipped: ReadonlyArray<Empty>): Empty;
function unzip<A>(zipped: NonEmptyArray.T<Single<A>>): Single<NonEmptyArray.T<A>>;
function unzip<A>(zipped: ReadonlyArray<Single<A>>): Single<A[]>;
function unzip<A, B>(
  zipped: NonEmptyArray.T<Pair<A, B>>
): Pair<NonEmptyArray.T<A>, NonEmptyArray.T<B>>;
function unzip<A, B>(zipped: ReadonlyArray<Pair<A, B>>): Pair<A[], B[]>;
function unzip<A, B, C>(
  zipped: NonEmptyArray.T<Triple<A, B, C>>
): Triple<NonEmptyArray.T<A>, NonEmptyArray.T<B>, NonEmptyArray.T<C>>;
function unzip<A, B, C>(zipped: ReadonlyArray<Triple<A, B, C>>): Triple<A[], B[], C[]>;
function unzip<Tup extends Single<any> | Pair<any, any> | Triple<any, any, any>>(
  tuples: ReadonlyArray<Tup>
) {
  if (tuples[0] === undefined) {
    return [];
  }

  const [firstTuple, ...rest] = tuples;

  const resTups = firstTuple.map((x) => [x]);

  rest.forEach((nextTup) =>
    resTups.forEach((resElem, resElemIndex) => {
      resElem.push(nextTup[resElemIndex]);
    })
  );

  return resTups as any;
}
