import * as Result from "./Result";
import * as RemoteData from "./RemoteData";

export {
  // Types
  Maybe,
  Just,
  Nothing,
  T,
  // Constructors
  just,
  nothing,
  of,
  // Typeguards
  isJust,
  isNothing,
  // Conversions
  fromResult,
  fromRemoteData,
  fromNullable,
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
  encase,
  encasePromise
};

//
// Types
//

/**
 * A `Maybe` is either a `Just` with data of type `A`, or a `Nothing`,
 * encoded as `undefined`.
 */
type Maybe<A> = A | undefined;

/** Alias for the `Maybe` type */
type T<A> = Maybe<A>;

/**
 * The `Just` variant of a `Maybe` is an alias for data of type `A`. The data
 * can be of any concrete type that isn't `undefined`.
 */
type Just<A> = Exclude<A, undefined>;

/**
 * The `Nothing` variant of a `Maybe` is `undefined`. This works best for
 * integrating with TypeScript fatures such as optional property notation,
 * since `propName?: Maybe<string>`, and `propName?: string` are equivalent
 * types. Values of this type can be constructed with the `Nothing` constant, or
 * by using `undefined` directly.
 */
type Nothing = undefined;

/* Create a wrapped type where each member of `T` is a `Maybe`. */
type MaybeMapped<T extends ReadonlyArray<any>> = { [k in keyof T]: Maybe<T[k]> };

/* Primitive/literal types which javascript considers false in a boolean context. */
type Falsy = false | undefined | null | "" | 0;

/* The `caseOf` function expects either exhaustive pattern matching, or
 * non-exhaustive with a `default` case.
 */
type CaseOfPattern<A, B> =
  | {
      Just: (x: Just<A>) => B;
      Nothing: () => B;
    }
  | {
      Just?: (x: Just<A>) => B;
      Nothing?: () => B;
      default: () => B;
    };

//
// Constructors
//

/**
 * A constructor for the `Just` variant of `Maybe`. It accepts any value `a`
 * except for `undefined`.
 */
function just<A>(a: Just<A>): Just<A> {
  return a;
}

/**
 * A constructor for the `Nothing` variant of `Maybe`, which is an alias
 * for undefined.
 */
const nothing: Nothing = undefined;

/** Alis for the `just` constructor. */
const of = just;

//
// Typeguards
//

/** Typeguard for the `Just` variant of a `Maybe`. */
function isJust<A>(x: Maybe<A>): x is Just<A> {
  return x !== nothing;
}

/** Typeguard for the `Nothing` variant of a `Maybe`. */
function isNothing<A>(x: Maybe<A>): x is Nothing {
  return x === nothing;
}

//
// Conversions
//

/**
 * Create a `Maybe` from a `Result` by replacing an `Err` with `Nothing`.
 *
 *     Ok<V>  -> Just<V>
 *     Err<E> -> Nothing
 */
const fromResult = Result.toMaybe;

/**
 * Create a `Maybe` from a `RemoteData` by mapping `Success` to `Just` and
 * everything else to `Nothing`.
 *
 *     NotAsked   -> Nothing
 *     Loading    -> Nothing
 *     Success<V> -> Just<V>
 *     Err<E>     -> Nothing
 */
const fromRemoteData = RemoteData.toMaybe;

/**
 * Given a value which might be null, return a `Maybe`. In other words,
 * substitute null with undefined.
 *
 *     null      -> Nothing
 *     undefined -> Nothing
 *     A         -> Just<A>
 */
function fromNullable<A>(x: A): Maybe<Exclude<A, null>> {
  return x == null ? nothing : (x as Just<Exclude<A, null>>);
}

/**
 * Keeps the value `a` if `test` returns true, otherwise returns `Nothing`.
 * Supports narrowing the return type via typeguards.
 */
function fromPredicate<A, B extends A>(a: A, test: (a: A) => a is B): Maybe<B>;
function fromPredicate<A>(a: A, test: (a: A) => boolean): Maybe<A>;
function fromPredicate<A>(a: A, test: (a: A) => boolean) {
  return test(a) ? a : nothing;
}

/** Keep truthy values, return `Nothing` for falsy values such as `null`, `0` and `""`. */
function fromFalsy<A>(x: A | Falsy): Maybe<A> {
  return !!x ? x : nothing;
}

/**
 * Given a `Maybe`, return a value which might be null. In other words, replace
 * undefined with null.
 *
 *     Just<A> -> A
 *     Nothing -> null
 */
function toNullable<A>(x: Maybe<A>): Just<A> | null {
  return isJust(x) ? x : null;
}

/**
 * Create a `Result` from a `Maybe` by providing the `Err` to use in place of a `Nothing`.
 *
 *     Just<A> -> Ok<A>
 *     Nothing -> Err<E>
 */
function toResult<V, E extends Error>(x: Maybe<V>, e: E): Result.T<Just<V>, E> {
  return isJust(x) ? x : e;
}

/**
 * Create a `RemoteData` from a `Maybe` by returning either a `NotAsked` or `Success`
 *
 *     Just<A> -> Success<A>
 *     Nothing -> NotAsked
 */
function toRemoteData<V>(x: Maybe<V>): RemoteData.Success<Just<V>> | RemoteData.NotAsked {
  return isNothing(x) ? RemoteData.notAsked : (x as RemoteData.Success<Just<V>>);
}

//
// Operations
//

/** Apply `fn` if `a` is a `Just`. Otherwise return `Nothing`. */
function map<A, B>(a: Nothing, fn: (a: A) => B): Nothing;
function map<A, B>(a: Just<A>, fn: (a: A) => B): B;
function map<A, B>(a: Maybe<A>, fn: (a: A) => B): Maybe<B>;
function map<A, B>(a: Maybe<A>, fn: (a: A) => B) {
  return isJust(a) ? fn(a) : nothing;
}

/** Provide a default which is used if `x` is `Nothing`. */
function withDefault<A>(x: Maybe<A>, defaultVal: undefined): Maybe<A>;
function withDefault<A, B>(x: Just<A>, defaultVal: Just<B>): Just<A>;
function withDefault<A, B>(x: Maybe<A>, defaultVal: Just<B>): Just<A | B>;
function withDefault<A, B>(x: Maybe<A>, defaultVal: Maybe<B>): Maybe<A | B>;
function withDefault(x: Maybe<any>, defaultVal: unknown) {
  return isJust(x) ? x : defaultVal;
}

/**
 * Like a `case` in languages with pattern matching. Apply the `justFn` to a
 * `Just` value and execute `nothingFn` for a `Nothing`.
 */
function unwrap<A, B>(x: Maybe<A>, justFn: (a: Just<A>) => B, nothingFn: () => B): B {
  return isJust(x) ? justFn(x) : nothingFn();
}

/**
 * Simulates an ML style `case x of` pattern match, following the same logic as
 * `unwrap`.
 */
function caseOf<A, B>(x: Maybe<A>, pattern: CaseOfPattern<A, B>): B {
  if (isJust(x) && pattern["Just"]) {
    return pattern["Just"](x);
  } else if (isNothing(x) && pattern["Nothing"]) {
    return pattern["Nothing"]();
  } else {
    return (pattern as any)["default"]();
  }
}

/**
 * If the values in the `xs` array are all `Just`s then return the array.
 * Otherwise return `Nothing`.
 */
function combine<T extends ReadonlyArray<any>>(xs: MaybeMapped<T>): Maybe<T>;
function combine<A>(xs: ReadonlyArray<Maybe<A>>): Maybe<Array<A>>;
function combine(xs: ReadonlyArray<Maybe<unknown>>) {
  const justVals = xs.filter(isJust);
  return justVals.length === xs.length ? justVals : nothing;
}

/**
 * Create a version of a function which returns a `Maybe` instead of throwing
 * an error.
 */
function encase<Args extends Array<any>, R>(fn: (...args: Args) => R): (...args: Args) => Maybe<R> {
  return (...args: Args) => {
    try {
      return fn(...args);
    } catch {
      return nothing;
    }
  };
}

/**
 * Given a promise, return a promise which will always fulfill, catching
 * rejected values as a `Nothing`.
 *
 *    fulfilled Promise<D> -> fulfilled Promise<Just<V>>
 *    rejected Promise<D>  -> fulfilled Promise<Nothing>
 */
function encasePromise<A>(p: Promise<A>): Promise<Maybe<A>> {
  return p.catch(() => nothing);
}
