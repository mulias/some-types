import * as Maybe from "./Maybe";

export {
  // Types
  NonEmptyArray,
  T,
  // Typeguards
  isNonEmptyArray,
  // Conversions
  fromElements,
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
// Typeguards
//

/** Typeguard to determine if an `Array` is a `NonEmptyArray`. */
const isNonEmptyArray = <A>(a: ReadonlyArray<A>): a is NonEmptyArray<A> => a.length > 0;

//
// Conversions
//

/** Create a `NonEmptyArray` from the one or more provided arguments. */
const fromElements = <Arr extends NonEmptyArray<any>>(...arr: Arr): Arr => arr;

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
const last = <A>(a: NonEmptyArray<A>): A => a[a.length - 1];

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
