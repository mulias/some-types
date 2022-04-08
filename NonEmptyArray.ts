import * as Maybe from "./Maybe";

export {
  // Types
  NonEmptyArray,
  T,
  // Constructors
  nonEmptyArray,
  of,
  // Typeguards
  isNonEmptyArray,
  // Conversions
  fromArray,
  // Operations
  head,
  tail,
  last,
  front,
  map,
  reverse,
  concat,
  sort
};

//
// Types
//

/**
 * A `NonEmptyArray` is an immutable `Array` that is known to have at least
 * one element.
 */
type NonEmptyArray<A> = readonly [A, ...A[]];

/** Alias for the `NonEmptyArray` type. */
type T<A> = NonEmptyArray<A>;

//
// Constructors
//

/** Create a NonEmptyArray with a `first` value and an optional `rest` array. */
function nonEmptyArray<A>(first: A, rest: A[] = []): NonEmptyArray<A> {
  return [first, ...rest];
}

/** Alias for the `nonEmptyArray` constructor. */
const of = nonEmptyArray;

//
// Typeguards
//

/** Typeguard for a `NonEmptyArray`. */
function isNonEmptyArray<A>(a: ReadonlyArray<A>): a is NonEmptyArray<A>;
function isNonEmptyArray<A = unknown>(a: unknown): a is NonEmptyArray<A>;
function isNonEmptyArray(a: unknown) {
  return Array.isArray(a) && a.length > 0;
}

//
// Conversions
//

/**
 * Return `a` as a `NonEmptyArray` if it's non-empty, or return
 * `Maybe.Nothing` if it's empty.
 */
function fromArray<A extends NonEmptyArray<any>>(a: A): A;
function fromArray<A>(a: A[]): Maybe.T<NonEmptyArray<A>>;
function fromArray(a: readonly any[]) {
  return isNonEmptyArray(a) ? a : undefined;
}

//
// Operations
//

/** Get the first element in a `NonEmptyArray`. */
function head<A>([h]: NonEmptyArray<A>): A {
  return h;
}

/** Return a new, possibly empty, Array with all but the first element. */
function tail<A>([_h, ...t]: NonEmptyArray<A>): readonly A[] {
  return t;
}

/** Get the last element in a `NonEmptyArray`. */
function last<A>(a: NonEmptyArray<A>): A {
  return a[a.length - 1] as A;
}

/** Return a new, possibly empty, Array with all but the last element. */
function front<A>(a: NonEmptyArray<A>): readonly A[] {
  return a.slice(0, a.length - 1);
}

/**
 * Apply `fn` to each element in the `NonEmptyArray`. Unlike
 * `Array.prototype.map`, this function preserves the `NonEmptyArray` type,
 * instead of returning an `Array`.
 */
function map<A, B>(
  a: NonEmptyArray<A>,
  fn: (a: A, index?: number, array?: NonEmptyArray<A>) => B
): NonEmptyArray<B> {
  return a.map(fn as any) as any;
}

/** Reverse the order of a `NonEmptyArray`, returning a shallow copy. */
function reverse<A>(a: NonEmptyArray<A>): NonEmptyArray<A> {
  return [...a].reverse() as any;
}

/** Concat two arrays, one of which must be a `NonEmptyArray`. */
function concat<A>(a1: NonEmptyArray<A>, a2: ReadonlyArray<A>): NonEmptyArray<A>;
function concat<A>(a1: ReadonlyArray<A>, a2: NonEmptyArray<A>): NonEmptyArray<A>;
function concat<A>(a1: ReadonlyArray<A>, a2: ReadonlyArray<A>): NonEmptyArray<A> {
  return [...a1, ...a2] as any;
}

/** Sort a `NonEmptyArray`, returning a shallow copy. */
function sort<A>(a: NonEmptyArray<A>): NonEmptyArray<A> {
  return [...a].sort() as any;
}
