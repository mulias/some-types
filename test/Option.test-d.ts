import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from "tsd";
import { Result } from "../lib/Result";
import { RemoteData } from "../lib/RemoteData";
import { DataError } from "../lib/DataError";
import {
  Option,
  Some,
  None,
  some,
  none,
  of,
  isSome,
  isNone,
  fromResult,
  fromRemoteData,
  fromNullable,
  fromPredicate,
  fromFalsy,
  toNullable,
  toResult,
  toRemoteData,
  ifSome,
  ifNone,
  orDefault,
  caseOf,
  consolidate,
  encase,
  encasePromise,
} from "../lib/Option";

const testOption = () => {
  let x: any;
  expectType<Option<string>>(x as string | undefined);
  expectType<Option<44>>(x as 44 | undefined);
  expectAssignable<Option<boolean>>(x as boolean);
  expectAssignable<Option<{ foo: 1 }>>(x as undefined);
  expectNotAssignable<Option<number>>(x as string);
};

const testnone = () => {
  expectType<undefined>(none);
};

const testSome = () => {
  expectType<5>(some(5));
  expectAssignable<number>(some(5));
  expectType<null>(some(null));
  expectType<any>(some(0 as any));
  expectType<unknown>(some(0 as unknown));
  expectType<never>(some(0 as never));
  expectError(some(undefined));
  expectError(some(none));
};

const testIsSome = () => {
  const x = none as Option<string>;
  if (isSome(x)) {
    expectType<string>(x);
  } else {
    expectType<None>(x);
  }

  expectType<number[]>([12, undefined, some(4), none].filter(isSome));
  expectType<Array<string | number>>([12, none, "string", 0].filter(isSome));
};

const testisNone = () => {
  const x = 12 as Option<number>;
  if (isNone(x)) {
    expectType<None>(x);
  } else {
    expectType<number>(x);
  }

  expectType<None[]>([12, undefined, some(4), none].filter(isNone));
  expectType<undefined[]>([12, none, "string", 0].filter(isNone));
};

const testFromNullable = () => {
  const x = null as string | null;
  expectType<Option<string>>(fromNullable(x));

  const y = null;
  expectType<None>(fromNullable(y));

  const z = 12 as number;
  expectType<Option<number>>(fromNullable(z));
};

const testFromPredicate = () => {
  const x = 5 as number;
  const pred = (a: number) => a % 2 === 0;
  expectType<Option<number>>(fromPredicate(x, pred));
};

const testFromFalsy = () => {
  const x = 0 as "" | 0 | 1 | 2 | boolean | undefined | null | "wow!";
  expectType<Option<1 | 2 | true | "wow!">>(fromFalsy(x));

  const y = "" as string;
  expectType<Option<string>>(fromFalsy(y));
};

const testToNullable = () => {
  const x = "test" as Option<string>;
  expectType<string | null>(toNullable(x));

  const y = undefined;
  expectType<null>(toNullable(y));

  const z = 0;
  expectType<0 | null>(toNullable(z));
};

const testToResult = () => {
  expectType<Result<null, DataError<string>>>(
    toResult(some(null), Result.errData("nothin")),
  );
  expectType<Result<number, Error>>(toResult(some(12 as number), Result.err()));
  expectType<Result<string, Error>>(
    toResult(none as Option<string>, Result.err()),
  );
  expectType<Result<never, Error>>(toResult(none, Result.err()));
  expectType<Result<string, Error>>(
    toResult<string, Error>(none, Result.err()),
  );
  expectError(toResult<string, Error>(some(9), Result.err()));
};

const testToRemoteData = () => {
  expectType<RemoteData.Success<null> | RemoteData.NotAsked>(
    toRemoteData(some(null)),
  );
  expectAssignable<RemoteData<null, Error>>(toRemoteData(some(null)));
  expectType<RemoteData.Success<number> | RemoteData.NotAsked>(
    toRemoteData(some(12 as number)),
  );
  expectAssignable<RemoteData<number, never>>(
    toRemoteData(12 as Option<number>),
  );
  expectAssignable<RemoteData<string, Error>>(
    toRemoteData(none as Option<string>),
  );
  expectType<RemoteData.NotAsked>(toRemoteData(none));
  expectAssignable<RemoteData<string, Error>>(toRemoteData<string>(none));
};

const testifSome = () => {
  const fnA = (x: number) => x + 1;
  expectType<number>(ifSome(0, fnA));
  expectType<None>(ifSome(none, fnA));
  expectType<Option<number>>(ifSome(0 as Option<number>, fnA));
  expectType<Option<number>>(ifSome(undefined as Option<number>, fnA));

  const fnB = (x: number) => String(x);
  expectType<string>(ifSome(0, fnB));
  expectType<None>(ifSome(none, fnB));
  expectType<Option<string>>(ifSome(0 as Option<number>, fnB));
  expectType<Option<string>>(ifSome(undefined as Option<number>, fnB));
};

const testifNone = () => {
  const fnA = () => 1;
  expectAssignable<number>(ifNone(0, fnA));
  expectType<true>(ifNone(true, fnA));
  expectType<number>(ifNone(none, fnA));
  expectType<number>(ifNone(0 as Option<number>, fnA));
  expectType<number | string>(ifNone("x" as Option<string>, fnA));
  expectType<number>(ifNone(undefined as Option<number>, fnA));

  const fnB = () => none;
  expectType<0>(ifNone(0, fnB));
  expectType<None>(ifNone(none, fnB));
  expectType<Option<number>>(ifNone(0 as Option<number>, fnB));
  expectType<Option<number>>(ifNone(undefined as Option<number>, fnB));
};

const testWithDefault = () => {
  expectType<0 | 3>(orDefault(3 as Option<3>, 0));
  expectType<number>(orDefault(3 as Option<number>, 0));
  expectAssignable<number>(orDefault(some(3), 0));
  expectAssignable<number | string>(orDefault(none as Option<number>, "oops"));
  expectType<number | undefined>(orDefault(4 as number | undefined, undefined));
};

const testCaseOf = () => {
  const a = caseOf(55 as Option<number>, {
    Some: (x) => x * 12,
    None: () => 0,
  });
  expectType<number>(a);

  const b = caseOf(some(4), {
    Some: (x) => (x === 0 ? none : String(x)),
    None: () => none,
  });
  expectType<Option<string>>(b);
};

const testConsolidate = () => {
  const w = [0] as number[];
  expectType<number[]>(consolidate(w));

  const x = [1, 2, 3, 4, undefined, 6, 7, 8, 9];
  expectType<Option<number[]>>(consolidate(x));

  const y = [some(true), some(false), none, some("x"), some({ a: 12 })];
  expectType<Option<Array<string | boolean | { a: number }>>>(consolidate(y));

  const xx = x as any[];
  expectType<Option<any[]>>(consolidate(xx));

  const xxx = x as unknown[];
  expectType<Option<unknown[]>>(consolidate(xxx));

  const z1 = [] as const;
  expectType<readonly []>(consolidate(z1));

  const z2 = [1] as [Option<number>];
  expectType<Option<[number]>>(consolidate(z2));

  const z3 = [1, "q"] as [Option<number>, Option<string>];
  expectType<Option<[number, string]>>(consolidate(z3));

  const z4 = [false, 0] as const;
  expectType<readonly [false, 0]>(consolidate(z4));

  const z5 = [12, undefined, none] as const;
  expectType<undefined>(consolidate(z5));

  const z6 = [1, 2, none, undefined] as [1, 2, None, undefined | number];
  expectType<undefined>(consolidate(z6));

  const z7 = [12, undefined, 0] as [12, any, number | undefined];
  expectType<Option<[12, any, number]>>(consolidate(z7));

  const z8 = [12, 3, 4] as [12, any, number];
  expectType<Option<[12, any, number]>>(consolidate(z8));
};

const testEncase = () => {
  const fn = (a: string, b?: number): string => {
    if (Number(a) == b) {
      throw "dang!";
    }
    return a;
  };

  expectType<(a: string, b?: number) => Option<string>>(encase(fn));
};

async function testEncasePromise() {
  const willReject: Promise<boolean> = new Promise((_, reject) => reject());
  expectType<Promise<Option<boolean>>>(encasePromise(willReject));
  expectType<Option<boolean>>(await encasePromise(willReject));
}
