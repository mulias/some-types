import * as Maybe from "./Maybe";

export {
  // Types
  NonEmptyArray,
  T,
  // Typeguards
  isNonEmptyArray,
  // Conversions
  fromArray,
  // Operations
  head,
  tail,
  last,
  map
};

//
// Types
//

/** TODO */
type NonEmptyArray<A> = readonly [A, ...A[]];

/** TODO */
type T<A> = NonEmptyArray<A>;

//
// Typeguards
//

/** TODO */
const isNonEmptyArray = <A>(a: ReadonlyArray<A>): a is NonEmptyArray<A> => a.length > 0;

//
// Conversions
//

/** TODO */
function fromArray<A extends readonly [A, ...any[]]>(a: A): A;
function fromArray<A>(a: readonly A[]): Maybe.T<NonEmptyArray<A>>;
function fromArray(a: readonly any[]) {
  return isNonEmptyArray(a) ? a : Maybe.Nothing;
}

//
// Operations
//

/** TODO */
const head = <A>([h]: NonEmptyArray<A>): A => h;

/** TODO */
const tail = <A>([h, ...t]: NonEmptyArray<A>): readonly A[] => t;

/** TODO */
const last = <A>(a: NonEmptyArray<A>): A => a[a.length - 1];

/** TODO */
const map = <A, B>(fn: (a: A) => B, a: NonEmptyArray<A>): NonEmptyArray<B> => a.map(fn) as any;
