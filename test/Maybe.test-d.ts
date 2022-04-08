import { expectType, expectAssignable, expectNotAssignable, expectError } from "tsd";
import * as Result from "../Result";
import * as AsyncData from "../AsyncData";
import * as DataError from "../DataError";
import {
  Maybe,
  Just,
  Nothing,
  just,
  nothing,
  of,
  isJust,
  isNothing,
  fromResult,
  fromAsyncData,
  fromNullable,
  fromPredicate,
  fromFalsy,
  toNullable,
  toResult,
  toAsyncData,
  map,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase,
  encasePromise
} from "../Maybe";

const testMaybe = () => {
  let x: any;
  expectType<Maybe<string>>(x as string | undefined);
  expectType<Maybe<44>>(x as 44 | undefined);
  expectAssignable<Maybe<boolean>>(x as boolean);
  expectAssignable<Maybe<{ foo: 1 }>>(x as undefined);
  expectNotAssignable<Maybe<number>>(x as string);
};

const testNothing = () => {
  expectType<undefined>(nothing);
};

const testJust = () => {
  expectType<5>(just(5));
  expectAssignable<number>(just(5));
  expectType<null>(just(null));
  expectType<any>(just(0 as any));
  expectType<unknown>(just(0 as unknown));
  expectType<never>(just(0 as never));
  expectError(just(undefined));
  expectError(just(nothing));
};

const testIsJust = () => {
  const x = nothing as Maybe<string>;
  if (isJust(x)) {
    expectType<string>(x);
  } else {
    expectType<Nothing>(x);
  }

  expectType<number[]>([12, undefined, just(4), nothing].filter(isJust));
  expectType<Array<string | number>>([12, nothing, "string", 0].filter(isJust));
};

const testIsNothing = () => {
  const x = 12 as Maybe<number>;
  if (isNothing(x)) {
    expectType<Nothing>(x);
  } else {
    expectType<number>(x);
  }

  expectType<Nothing[]>([12, undefined, just(4), nothing].filter(isNothing));
  expectType<undefined[]>([12, nothing, "string", 0].filter(isNothing));
};

const testFromNullable = () => {
  const x = null as string | null;
  expectType<Maybe<string>>(fromNullable(x));

  const y = null;
  expectType<Nothing>(fromNullable(y));

  const z = 12 as number;
  expectType<Maybe<number>>(fromNullable(z));
};

const testFromPredicate = () => {
  const x = 5 as number;
  const pred = (a: number) => a % 2 === 0;
  expectType<Maybe<number>>(fromPredicate(x, pred));
};

const testFromFalsy = () => {
  const x = 0 as "" | 0 | 1 | 2 | boolean | undefined | null | "wow!";
  expectType<Maybe<1 | 2 | true | "wow!">>(fromFalsy(x));

  const y = "" as string;
  expectType<Maybe<string>>(fromFalsy(y));
};

const testToNullable = () => {
  const x = "test" as Maybe<string>;
  expectType<string | null>(toNullable(x));

  const y = undefined;
  expectType<null>(toNullable(y));

  const z = 0;
  expectType<0 | null>(toNullable(z));
};

const testToResult = () => {
  expectType<Result.T<null, DataError.T<string>>>(toResult(just(null), Result.errData("nothin")));
  expectType<Result.T<number, Error>>(toResult(just(12 as number), Result.err()));
  expectType<Result.T<string, Error>>(toResult(nothing as Maybe<string>, Result.err()));
  expectType<Result.T<never, Error>>(toResult(nothing, Result.err()));
  expectType<Result.T<string, Error>>(toResult<string, Error>(nothing, Result.err()));
  expectError(toResult<string, Error>(just(9), Result.err()));
};

const testToAsyncData = () => {
  expectType<AsyncData.Success<null> | AsyncData.NotAsked>(toAsyncData(just(null)));
  expectAssignable<AsyncData.T<null, Error>>(toAsyncData(just(null)));
  expectType<AsyncData.Success<number> | AsyncData.NotAsked>(toAsyncData(just(12 as number)));
  expectAssignable<AsyncData.T<number, never>>(toAsyncData(12 as Maybe<number>));
  expectAssignable<AsyncData.T<string, Error>>(toAsyncData(nothing as Maybe<string>));
  expectType<AsyncData.NotAsked>(toAsyncData(nothing));
  expectAssignable<AsyncData.T<string, Error>>(toAsyncData<string>(nothing));
};

const testMap = () => {
  const fnA = (x: number) => x + 1;
  expectType<number>(map(0, fnA));
  expectType<Nothing>(map(nothing, fnA));
  expectType<Maybe<number>>(map(0 as Maybe<number>, fnA));
  expectType<Maybe<number>>(map(undefined as Maybe<number>, fnA));

  const fnB = (x: number) => String(x);
  expectType<string>(map(0, fnB));
  expectType<Nothing>(map(nothing, fnB));
  expectType<Maybe<string>>(map(0 as Maybe<number>, fnB));
  expectType<Maybe<string>>(map(undefined as Maybe<number>, fnB));
};

const testWithDefault = () => {
  expectType<0 | 3>(withDefault(3 as Maybe<3>, 0));
  expectType<number>(withDefault(3 as Maybe<number>, 0));
  expectAssignable<number>(withDefault(just(3), 0));
  expectAssignable<number | string>(withDefault(nothing as Maybe<number>, "oops"));
  expectType<number | undefined>(withDefault(4 as number | undefined, undefined));
};

const testUnwrap = () => {
  const a = unwrap(
    55,
    (x) => x * 12,
    () => 0
  );
  expectType<number>(a);

  const b = unwrap(
    just(4),
    (x) => (x === 0 ? nothing : String(x)),
    () => nothing
  );
  expectType<Maybe<string>>(b);

  const c = unwrap<number, number | string>(
    99 as Maybe<number>,
    (x) => x - 99,
    () => "nope"
  );
  expectType<number | string>(c);
};

const testCaseOf = () => {
  const a = caseOf(55 as Maybe<number>, {
    Just: (x) => x * 12,
    Nothing: () => 0
  });
  expectType<number>(a);

  const b = caseOf(just(4), {
    Just: (x) => (x === 0 ? nothing : String(x)),
    Nothing: () => nothing
  });
  expectType<Maybe<string>>(b);
};

const testCombine = () => {
  const x = [1, 2, 3, 4, undefined, 6, 7, 8, 9];
  const y = [just(true), just(false), nothing, just("x"), just({ a: 12 })];
  expectType<Maybe<number[]>>(combine(x));
  expectType<Maybe<Array<string | boolean | { a: number }>>>(combine(y));
  expectType<Maybe<any[]>>(combine(x as any[]));

  const z1 = [] as const;
  const z2 = [1] as [Maybe<number>];
  const z3 = [1, "q"] as [Maybe<number>, Maybe<string>];
  const z4 = [false, 0] as const;
  expectType<Maybe<readonly []>>(combine(z1));
  expectType<Maybe<[number]>>(combine(z2));
  expectType<Maybe<[number, string]>>(combine(z3));
  expectType<Maybe<readonly [false, 0]>>(combine(z4));
};

const testEncase = () => {
  const fn = (a: string, b?: number): string => {
    if (Number(a) == b) {
      throw "dang!";
    }
    return a;
  };

  expectType<(a: string, b?: number) => Maybe<string>>(encase(fn));
};

async function testEncasePromise() {
  const willReject: Promise<boolean> = new Promise((_, reject) => reject());
  expectType<Promise<Maybe<boolean>>>(encasePromise(willReject));
  expectType<Maybe<boolean>>(await encasePromise(willReject));
}
