import * as Result from "./Result";
import * as RemoteData from "./RemoteData";

export {
  // Types
  Maybe,
  T,
  // Constructors
  Just,
  Nothing,
  // Typeguards
  isJust,
  isNothing,
  // Conversions
  fromResult,
  fromRemoteData,
  fromNullable,
  fromPromise,
  fromPredicate,
  fromFalsy,
  toNullable,
  toResult,
  toRemoteData,
  // Operations
  map,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase
};

//
// Types
//

/**
 * A `Maybe` is either a `Just` containing data of type `A`, or a `Nothing`,
 * encoded as `undefined`.
 */
type Maybe<A> = Just<A> | Nothing;

/** Alias for the `Maybe` type */
type T<A> = Maybe<A>;

/**
 * The `Just` variant of a `Maybe` is an alias for the data of type `A`.
 * Effectively a `Just` can be any value except `undefined`. Values of this
 * type can be constructed with the `Just` function.
 */
type Just<A> = A;

/**
 * The `Nothing` variant of a `Maybe` is `undefined`. This works best for
 * integrating with TypeScript fatures such as optional property notation,
 * since `propName?: Maybe<string>`, and `propName?: string` are equivalent
 * type. Values of this type can be constructed with the `Nothing` constant.
 */
type Nothing = undefined;

/* Create a wrapped type where each member of `T` is a `Maybe`. */
type MaybeMapped<T> = { [k in keyof T]: Maybe<T[k]> };

/* TODO */
type Falsy = undefined | null | "" | 0;

//
// Constructors
//

/**
 * A constructor for the `Just` variant of `Maybe`, which is effectively the
 * identity function.
 */
const Just = <A>(a: A): Maybe<A> => a;

/**
 * A constructor for the `Nothing` variant of `Maybe`, which is an alias
 * for undefined.
 */
const Nothing: Maybe<never> = undefined;

//
// Typeguards
//

/** Typeguard for the `Just` variant of a `Maybe` */
const isJust = <A>(x: Maybe<A>): x is A => x !== Nothing;

/** Typeguard for the `Nothing` variant of a `Maybe` */
const isNothing = <A>(x: Maybe<A>): x is Nothing => x === Nothing;

//
// Conversions
//

/** Create a `Maybe` from a `Result` by dropping the `Err` value for a `Nothing. */
const fromResult = Result.toMaybe;

/** TODO */
const fromRemoteData = RemoteData.toMaybe;

/**
 * Given a value which might be null, return a `Maybe`. In other words, substitute null
 * with undefined.
 */
const fromNullable = <A>(x: A): Maybe<Exclude<A, null>> =>
  (x == null ? Nothing : x) as Maybe<Exclude<A, null>>;

/** TODO */
const fromPromise = <A>(p: Promise<A>): Promise<Maybe<A>> => p.catch(() => Nothing);

/** Keeps the value if `test` returns true, otherwise returns `Nothing`. */
const fromPredicate = <A>(test: (a: A) => boolean, a: A): Maybe<A> => (test(a) ? a : Nothing);

/** Keep truthy values, return `Nothing` for falsy values such as `null`, `0` and `""`. */
const fromFalsy = <A>(x: Maybe<A>): Maybe<Exclude<A, Falsy>> =>
  !!x ? (x as Exclude<A, Falsy>) : Nothing;

/**
 * Given a `Maybe`, return a value which might be null. In other words, replace
 * undefined with null.
 */
const toNullable = <A>(x: A): Exclude<A, undefined> | null =>
  (isNothing(x) ? null : x) as Exclude<A, undefined> | null;

/** Create a `Result` from a `Maybe` by providing the `Err` to use in place of a `Nothing`. */
const toResult = <V, E>(e: Result.Err<E>, x: Maybe<V>): Result.T<V, E> => (isJust(x) ? x : e);

/** TODO */
const toRemoteData = <V, E>(x: Maybe<V>): RemoteData.T<V, E> =>
  isNothing(x) ? RemoteData.NotAsked : (x as RemoteData.T<V, E>);

//
// Operations
//

/**
 * Apply `fn` if the `maybeArgs` are all `Just`s. Otherwise return `Nothing`.
 */
const map = <Args extends Array<any>, R>(
  fn: (...args: Args) => R,
  ...maybeArgs: MaybeMapped<Args>
): Maybe<R> => {
  const justVals = maybeArgs.filter(isJust);
  return justVals.length === maybeArgs.length ? fn(...(justVals as Args)) : Nothing;
};

/**
 * Provide a default which is used if `x` is `Nothing`.
 */
const withDefault = <A>(defaultVal: A, x: Maybe<A>): A => (isJust(x) ? x : defaultVal);

/**
 * Like a `case` in languages with pattern matching. Apply the `justFn` to a
 * `Just` value and execute `nothingFn` for a `Nothing`.
 */
const unwrap = <A, B>(justFn: (a: A) => B, nothingFn: () => B, x: Maybe<A>): B =>
  isJust(x) ? justFn(x) : nothingFn();

/**
 * Simulates an ML style `case x of` pattern match, following the same logic as
 * `unwrap`.
 */
const caseOf = <A, B>(pattern: { Just: (x: A) => B; Nothing: () => B }, x: Maybe<A>): B =>
  isJust(x) ? pattern["Just"](x) : pattern["Nothing"]();

/**
 * If the values in the `xs` array are all `Just`s then return the array.
 * Otherwise return `Nothing`.
 */
const combine = <A>(xs: ReadonlyArray<Maybe<A>>): Maybe<Array<A>> => {
  const justVals = xs.filter(isJust);
  return justVals.length === xs.length ? justVals : Nothing;
};

/**
 * Create a version of a function which returns a `Maybe` instead of throwing
 * an error.
 */
const encase = <Args extends Array<any>, R>(
  throws: (...args: Args) => R
): ((...args: Args) => Maybe<R>) => (...args: Args) => {
  try {
    return throws(...args);
  } catch {
    return Nothing;
  }
};
