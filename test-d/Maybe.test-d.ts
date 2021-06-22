import { expectType, expectAssignable, expectNotAssignable, expectError } from "tsd";
import * as Result from "../Result";
import * as AsyncData from "../AsyncData";
import * as ErrorData from "../ErrorData";
import {
  Maybe,
  Just,
  Nothing,
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
  expectType<undefined>(Nothing);
};

const testJust = () => {
  expectType<5>(Just(5));
  expectAssignable<number>(Just(5));
  expectType<null>(Just(null));
  expectType<any>(Just(0 as any));
  expectType<unknown>(Just(0 as unknown));
  expectType<never>(Just(0 as never));
  expectError(Just(undefined));
  expectError(Just(Nothing));
};

const testIsJust = () => {
  const x = Nothing as Maybe<string>;
  if (isJust(x)) {
    expectType<string>(x);
  } else {
    expectType<Nothing>(x);
  }

  expectType<number[]>([12, undefined, Just(4), Nothing].filter(isJust));
  expectType<Array<string | number>>([12, Nothing, "string", 0].filter(isJust));
};

const testIsNothing = () => {
  const x = 12 as Maybe<number>;
  if (isNothing(x)) {
    expectType<Nothing>(x);
  } else {
    expectType<number>(x);
  }

  expectType<Nothing[]>([12, undefined, Just(4), Nothing].filter(isNothing));
  expectType<undefined[]>([12, Nothing, "string", 0].filter(isNothing));
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
  expectType<Maybe<number>>(fromPredicate(pred, x));
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
  expectType<Result.T<null, ErrorData.T<string>>>(toResult(Result.ErrData("nothin"), Just(null)));
  expectType<Result.T<number, Error>>(toResult(Result.Err(), Just(12 as number)));
  expectType<Result.T<string, Error>>(toResult(Result.Err(), Nothing as Maybe<string>));
  expectType<Result.T<never, Error>>(toResult(Result.Err(), Nothing));
  expectType<Result.T<string, Error>>(toResult<string, Error>(Result.Err(), Nothing));
  expectError(toResult<string, Error>(Result.Err(), Just(9)));
};

const testToAsyncData = () => {
  expectType<AsyncData.Success<null> | AsyncData.NotAsked>(toAsyncData(Just(null)));
  expectAssignable<AsyncData.T<null, Error>>(toAsyncData(Just(null)));
  expectType<AsyncData.Success<number> | AsyncData.NotAsked>(toAsyncData(Just(12 as number)));
  expectAssignable<AsyncData.T<number, never>>(toAsyncData(12 as Maybe<number>));
  expectAssignable<AsyncData.T<string, Error>>(toAsyncData(Nothing as Maybe<string>));
  expectType<AsyncData.NotAsked>(toAsyncData(Nothing));
  expectAssignable<AsyncData.T<string, Error>>(toAsyncData<string>(Nothing));
};

const testMap = () => {
  const fnA = (x: number) => x + 1;
  expectType<number>(map(fnA, 0));
  expectType<Nothing>(map(fnA, Nothing));
  expectType<Maybe<number>>(map(fnA, 0 as Maybe<number>));
  expectType<Maybe<number>>(map(fnA, undefined as Maybe<number>));

  const fnB = (x: number) => String(x);
  expectType<string>(map(fnB, 0));
  expectType<Nothing>(map(fnB, Nothing));
  expectType<Maybe<string>>(map(fnB, 0 as Maybe<number>));
  expectType<Maybe<string>>(map(fnB, undefined as Maybe<number>));
};

const testWithDefault = () => {
  expectType<0 | 3>(withDefault(0, 3 as Maybe<3>));
  expectType<number>(withDefault(0, 3 as Maybe<number>));
  expectAssignable<number>(withDefault(0, Just(3)));
  expectAssignable<number | string>(withDefault("oops", Nothing as Maybe<number>));
  withDefault(undefined, 4 as number | undefined);
};

const testUnwrap = () => {
  const a = unwrap(
    (x) => x * 12,
    () => 0,
    55
  );
  expectType<number>(a);

  const b = unwrap(
    (x) => (x === 0 ? Nothing : String(x)),
    () => Nothing,
    Just(4)
  );
  expectType<Maybe<string>>(b);

  const c = unwrap<number, number | string>(
    (x) => x - 99,
    () => "nope",
    99 as Maybe<number>
  );
  expectType<number | string>(c);
};

const testCaseOf = () => {
  const a = caseOf(
    {
      Just: (x) => x * 12,
      Nothing: () => 0
    },
    55 as Maybe<number>
  );
  expectType<number>(a);

  const b = caseOf(
    {
      Just: (x) => (x === 0 ? Nothing : String(x)),
      Nothing: () => Nothing
    },
    Just(4)
  );
  expectType<Maybe<string>>(b);
};

const testCombine = () => {
  const x = [1, 2, 3, 4, undefined, 6, 7, 8, 9];
  const y = [Just(true), Just(false), Nothing, Just("x"), Just({ a: 12 })];
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
