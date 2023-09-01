import { RemoteData } from "../RemoteData/namespace";
import { Result } from "../Result/namespace";
import { Equals, IsAnyOrUnknown } from "../type_util";
import { Some, Some as SomeImpl } from "./Some/namespace";
import { None, None as NoneImpl } from "./None/namespace";

/**
 *
 * Type: An `Option<A>` is a value that may or may not be present. Values of
 * this type are either `Some<A>`, a desired value of type `A`, or `None`, the
 * lack of that value encoded as `undefined`.
 *
 */
export type Option<A> = A | undefined;

export declare namespace Option {
  export { Some, None };
}

/**
 *
 * Namespace: The `Option` namespace contains functions for `Option` values
 * including constructors, type guards, conversions to other data types, and
 * operations over the type.
 *
 */
export namespace Option {
  //
  // Namespaces
  //

  Option.Some = SomeImpl;
  Option.None = NoneImpl;

  //
  // Types
  //

  type Some<A> = Option.Some<A>;
  type None = Option.None;

  /* Create a type where each member of the array `T` is a `Some`. */
  type SomeMapped<T extends ReadonlyArray<any>> = {
    [k in keyof T]: Some<T[k]>;
  };

  /* Primitive/literal types which are considered false in a boolean context. */
  type Falsy = false | undefined | null | "" | 0;

  /* Predicate to test if every array element is a Some value. */
  type IsAllSome<T extends ReadonlyArray<any>> = IsAnyOrUnknown<
    T[number]
  > extends 1
    ? 0
    : Equals<Extract<T[number], undefined>, never>;

  /* Predicate to test if at least one array element is strictly None. */
  type HasStrictlyNoneElement<T extends ReadonlyArray<any>> = {
    [k in keyof T]: IsAnyOrUnknown<T[k]> extends 0
    ? Exclude<T[k], undefined> extends never
    ? T[k]
    : never
    : never;
  }[number] extends never
    ? 0
    : 1;

  /* Transform type with shape `Option<A>[]` into `Option<A[]>`, while preserving
   * readonly arrays and tuples.
   */
  type ConsolidateTuple<T extends ReadonlyArray<any>> =
    HasStrictlyNoneElement<T> extends 1
    ? None
    : IsAllSome<T> extends 1
    ? T
    : Option<SomeMapped<T>>;

  /* The `caseOf` function expects either exhaustive pattern matching, or
   * non-exhaustive with a `default` case.
   */
  type CaseOfPattern<A, B> =
    | {
      Some: (x: Some<A>) => B;
      None: () => B;
    }
    | {
      Some?: (x: Some<A>) => B;
      None?: () => B;
      default: () => B;
    };

  //
  // Constructors
  //

  /**
   * A constructor for the `Some` variant of `Option`. It accepts any value `a`
   * except for `undefined`.
   */
  export const some = Some.of;

  /**
   * A constructor for the `Some` variant of `Option`. It accepts any value `a`
   * except for `undefined`.
   */
  export const of = Some.of;

  /**
   * A constructor for the `None` variant of `Option`, which is an alias
   * for undefined.
   */
  export const none = None.value;

  //
  // Typeguards
  //

  /** Typeguard for the `Some` variant of a `Option`. */
  export const isSome = Some.isType;

  /** Typeguard for the `None` variant of a `Option`. */
  export const isNone = None.isType;

  //
  // Conversions
  //

  /**
   * Create a `Option` from a `Result` by replacing an `Err` with `None`.
   *
   *     Ok<V>  -> Some<V>
   *     Err<E> -> None
   */
  export function fromResult<A>(x: A): Option<Result.Ok<A>> {
    return Result.isOk(x) ? x : undefined;
  }

  /**
   * Create a `Option` from a `RemoteData` by mapping `Success` to `Some` and
   * everything else to `None`.
   *
   *     NotAsked   -> None
   *     Loading    -> None
   *     Success<V> -> Some<V>
   *     Err<E>     -> None
   */
  export function fromRemoteData<A>(
    x: RemoteData.Success<A>,
  ): RemoteData.Success<A>;
  export function fromRemoteData<
    A extends RemoteData.NotAsked | RemoteData.Loading | Error,
  >(x: A): None;
  export function fromRemoteData<A>(x: A): Option<RemoteData.Success<A>>;
  export function fromRemoteData(x: unknown) {
    return RemoteData.isSuccess(x) ? x : undefined;
  }

  /**
   * Given a value which might be null, return a `Option`. In other words,
   * substitute null with undefined.
   *
   *     null      -> None
   *     undefined -> None
   *     A         -> Some<A>
   */
  export function fromNullable<A>(x: A): Option<Exclude<A, null>> {
    return x == null ? none : (x as Exclude<A, null>);
  }

  /**
   * Keeps the value `a` if `test` returns true, otherwise returns `None`.
   * Supports narrowing the return type via typeguards.
   */
  export function fromPredicate<A, B extends A>(
    a: A,
    test: (a: A) => a is B,
  ): Option<B>;
  export function fromPredicate<A>(a: A, test: (a: A) => boolean): Option<A>;
  export function fromPredicate<A>(a: A, test: (a: A) => boolean) {
    return test(a) ? a : none;
  }

  /** Keep truthy values, return `None` for falsy values such as `null`, `0` and `""`. */
  export function fromFalsy<A>(x: A | Falsy): Option<A> {
    return !!x ? x : none;
  }

  /**
   * Given a `Option`, return a value which might be null. In other words, replace
   * undefined with null.
   *
   *     Some<A> -> A
   *     None    -> null
   */
  export function toNullable<A>(x: Option<A>): Some<A> | null {
    return isSome(x) ? x : null;
  }

  /**
   * Create a `Result` from a `Option` by providing the `Err` to use in place of a `None`.
   *
   *     Some<A> -> Ok<A>
   *     None    -> Err<E>
   */
  export function toResult<V, E extends Error>(
    x: Option<V>,
    e: E,
  ): Result<Some<V>, E> {
    return isSome(x) ? x : e;
  }

  /**
   * Create a `RemoteData` from a `Option` by returning either a `NotAsked` or `Success`
   *
   *     Some<A> -> Success<A>
   *     None    -> NotAsked
   */
  export function toRemoteData<V>(
    x: Option<V>,
  ): RemoteData.Success<Some<V>> | RemoteData.NotAsked {
    return isNone(x) ? RemoteData.notAsked : (x as RemoteData.Success<Some<V>>);
  }

  /**
   * Assert that `x` is a `Some`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export const coerceSome = Some.coerce;

  /**
   * Assert that `x` is `None`. If the assertion holds then return `x` with an
   * updated type. If the assertion fails throw an error.
   */
  export const coerceNone = None.coerce;

  //
  // Operations
  //

  /** Apply `fn` if `x` is a `Some`. Otherwise return `None`. */
  export const ifSome = Some.ifType;

  /** Call `fn` if `x` is `None`. Otherwise return `x`. */
  export const ifNone = None.ifType;

  /** Return `defaultVal` if `x` is `None`. Otherwise return `x`. */
  export function orDefault<A>(x: None, defaultVal: A): A;
  export function orDefault<A, B>(x: Some<A>, defaultVal: B): Some<A>;
  export function orDefault<A, B>(x: Option<A>, defaultVal: B): Some<A> | B;
  export function orDefault<A, B>(x: Option<A>, defaultVal: B) {
    return isNone(x) ? defaultVal : x;
  }

  /**
   * Similar to a `case` expression in languages with pattern matching. The
   * `pattern` object either needs to be exhastive or needs to have a `default`
   * branch.
   */
  export function caseOf<A, B>(x: Option<A>, pattern: CaseOfPattern<A, B>): B {
    if (isSome(x) && pattern["Some"]) {
      return pattern["Some"](x);
    } else if (isNone(x) && pattern["None"]) {
      return pattern["None"]();
    } else {
      return (pattern as any)["default"]();
    }
  }

  /**
   * If the values in the `xs` array are all `Some`s then return a shallow copy
   * of the array. Otherwise return `None`. At a type level this function takes
   * values of type `Option<A>[]` and returns values of type `Option<A[]>`.
   */
  export function consolidate<T extends ReadonlyArray<any>>(
    xs: T,
  ): ConsolidateTuple<T>;
  export function consolidate<A>(xs: Array<Option<A>>): Option<Array<A>>;
  export function consolidate(xs: ReadonlyArray<unknown>) {
    const someVals = xs.filter(isSome);
    return someVals.length === xs.length ? someVals : none;
  }

  /**
   * Create a version of a function which returns a `Option` instead of throwing
   * an error.
   */
  export function encase<Args extends Array<any>, R>(fn: (...args: Args) => R) {
    return (...args: Args): Option<R> => {
      try {
        return fn(...args);
      } catch {
        return none;
      }
    };
  }

  /**
   * Given a promise, return a promise which will always fulfill, catching
   * rejected values as `None`.
   */
  export async function encasePromise<A>(
    p: PromiseLike<A>,
  ): Promise<Option<A>> {
    try {
      return await p;
    } catch {
      return none;
    }
  }
}
