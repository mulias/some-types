import * as Maybe from "./Maybe";

export {
  // Types
  NonEmptyArray,
  T,
  // Constructors
  // NonEmptyArray,
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
  reverse
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
const NonEmptyArray = <A>(first: A, rest: A[] = []): NonEmptyArray<A> => [first, ...rest];

/** Alias for the `NonEmptyArray` constructor. */
const of = NonEmptyArray;

//
// Typeguards
//

/** Typeguard for a `NonEmptyArray`. */
function isNonEmptyArray<A>(a: ReadonlyArray<A>): a is NonEmptyArray<A>;
function isNonEmptyArray(a: unknown): a is NonEmptyArray<unknown>;
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
function fromArray<A>(a: readonly A[]): Maybe.T<NonEmptyArray<A>>;
function fromArray(a: readonly any[]) {
  return isNonEmptyArray(a) ? a : Maybe.Nothing;
}

//
// Operations
//

/** Get the first element in a `NonEmptyArray`. */
const head = <A>([h]: NonEmptyArray<A>): A => h;

/** Return a new, possibly empty, Array with all but the first element. */
const tail = <A>([h, ...t]: NonEmptyArray<A>): readonly A[] => t;

/** Get the last element in a `NonEmptyArray`. */
const last = <A>(a: NonEmptyArray<A>): A => a[a.length - 1] as A;

/** Return a new, possibly empty, Array with all but the last element. */
const front = <A>(a: NonEmptyArray<A>): readonly A[] => a.slice(0, a.length - 1);

/**
 * Apply `fn` to each element in the `NonEmptyArray`. Unlike
 * `Array.prototype.map`, this function preserves the `NonEmptyArray` type,
 * instead of returning an `Array`.
 */
const map = <A, B>(
  fn: (a: A, index?: number, array?: NonEmptyArray<A>) => B,
  a: NonEmptyArray<A>
): NonEmptyArray<B> => a.map(fn as any) as any;

/** Reverse the order of a `NonEmptyArray`, returning a shallow copy. */
const reverse = <A>(a: NonEmptyArray<A>): NonEmptyArray<A> => ([...a] as any).reverse();
