import * as Maybe from "./Maybe";

export {
  // Types (and constructor)
  Pair,
  T,
  // Typeguards
  isPair,
  // Conversions
  fromArray,
  // Operations
  first,
  second,
  mapFirst,
  mapSecond,
  mapBoth,
  swap
};

//
// Types
//

/** TODO */
type Pair<A, B> = readonly [A, B];

/** TODO */
type T<A, B> = Pair<A, B>;

//
// Constructors
//

/** TODO */
const Pair = <A, B>(a: A, b: B): Pair<A, B> => [a, b];

//
// Typeguards
//

/** TODO */
function isPair<P extends Pair<any, any>>(arr: P): arr is P;
function isPair<A>(arr: readonly A[]): arr is Pair<A, A>;
function isPair(arr: readonly any[]) {
  return arr.length === 2;
}

//
// Conversions
//

/** TODO */
function fromArray<P extends Pair<any, any>>(arr: P): P;
function fromArray<A>(arr: readonly A[]): Maybe.T<Pair<A, A>>;
function fromArray(arr: readonly any[]) {
  return isPair(arr) ? arr : Maybe.Nothing;
}

//
// Operations
//

/** TODO */
const first = <A, B>(t: Pair<A, B>): A => t[0];

/** TODO */
const second = <A, B>(t: Pair<A, B>): B => t[1];

/** TODO */
const mapFirst = <A, B, C>(fn: (a: A) => C, [a, b]: Pair<A, B>): Pair<C, B> => [fn(a), b];

/** TODO */
const mapSecond = <A, B, C>(fn: (b: B) => C, [a, b]: Pair<A, B>): Pair<A, C> => [a, fn(b)];

/** TODO */
const mapBoth = <A, B, C, D>(
  fnA: (a: A) => C,
  fnB: (b: B) => D,
  [a, b]: Pair<A, B>
): Pair<C, D> => [fnA(a), fnB(b)];

/** TODO */
const swap = <A, B>([a, b]: Pair<A, B>): Pair<B, A> => [b, a];
