import { expectType, expectAssignable, expectNotAssignable } from "tsd";
import { DataError } from "../lib/DataError";
import {
  Result,
  Ok,
  Err,
  ok,
  err,
  errData,
  isOk,
  isErr,
  toOption,
  toRemoteData,
  ifOk,
  ifErr,
  orDefault,
  match,
  consolidate,
  encase,
  encasePromise,
} from "../lib/Result";

const testResult = () => {
  let x: any;
  expectType<Result<string, DataError<number>>>(
    x as string | DataError<number>,
  );
  expectType<Result<44, DataError<"error">>>(x as 44 | DataError<"error">);
  expectAssignable<Result<boolean, never>>(x as boolean);
  expectAssignable<Result<boolean, DataError<{ foo: 0 }>>>(x as boolean);
  expectAssignable<Result<{ foo: 1 }, Error>>(x as Error);
  expectNotAssignable<Result<number, Error>>(x as string);
};

const testOk = () => {
  expectType<5>(ok(5));
  expectAssignable<5 | Error>(ok(5));
  expectType<number>(ok<number>(5));
  expectType<null>(ok(null));
  expectType<undefined>(ok(undefined));
  expectType<any>(ok(0 as any));
  expectType<unknown>(ok(0 as unknown));
  expectType<never>(ok(0 as never));
};

const testErr = () => {
  expectType<Error>(err());
  expectType<Error>(err("optional message"));
};

const testErrData = () => {
  expectType<Err<DataError<5>>>(errData(5));
  expectType<Err<DataError<number>>>(errData<number>(5));
  expectAssignable<Err<DataError<number>>>(errData(5));
  expectType<DataError<null>>(errData(null));
  expectType<DataError<undefined>>(errData(undefined));
  expectType<DataError<any>>(errData(0 as any));
  expectType<DataError<unknown>>(errData(0 as unknown));
  expectType<DataError<never>>(errData(0 as never));
};

const testIsOk = () => {
  const x = errData(1) as Result<string, DataError<number>>;
  if (isOk(x)) {
    expectType<string>(x);
  } else {
    expectType<Err<DataError<number>>>(x);
  }
};

const testIsErr = () => {
  const x = ok(false) as Result<boolean, Error>;
  if (isOk(x)) {
    expectType<boolean>(x);
  } else {
    expectType<Error>(x);
  }
};

const testToOption = () => { };

const testToRemoteData = () => { };

interface DataFooError<D> extends DataError<D> {
  foo: string;
}

const testMap = () => {
  // (number) => number
  const fnA = (x: number) => x + 1;
  // (number) => DataError<string>
  const fnB = (_x: number) => errData("I don't like numbers");
  // () => DataError<number>
  const fnC = () => errData(0);
  // (number) => Result<number, DataError<string>>
  const fnD = (x: number) =>
    x === 72 ? errData("I don't like that number") : x;

  // (E, (A) => any) => E
  expectType<Error>(ifOk(err(), fnA));
  expectType<Error>(ifOk(err(), fnB));
  expectType<Error>(ifOk(err(), fnC));
  expectType<Error>(ifOk(err(), fnD));
  expectType<DataError<number>>(ifOk(errData(0), fnA));
  expectType<DataError<number>>(ifOk(errData(0), fnB));
  expectType<DataError<number>>(ifOk(errData(0), fnC));
  expectType<DataError<number>>(ifOk(errData(0), fnD));

  // (A, (A) => B) => B
  expectType<number>(ifOk(0, fnA));
  expectType<string>(ifOk(0, String));

  // (A, (A) => E) => E
  expectType<DataError<string>>(ifOk(0, fnB));
  expectType<DataError<number>>(ifOk(0, fnC));

  // (Result<A, E>, (A) => B) => Result<B, E>
  expectType<Result<number, Error>>(ifOk(0 as Result<number, Error>, fnA));
  expectType<Result<string, DataError<boolean>>>(
    ifOk(0 as Result<number, DataError<boolean>>, String),
  );

  // (Result<A, EA>, (A) => EB) => EA | EB
  expectAssignable<DataError<number | string>>(
    ifOk(0 as Result<number, DataError<number>>, fnB),
  );
  expectAssignable<DataError<number | string>>(
    ifOk(0 as Result<number, DataError<string>>, fnC),
  );
  expectAssignable<DataError<number>>(
    ifOk(0 as Result<number, DataError<number>>, fnC),
  );

  // (Result<A, EA>, (A) => Result<B, EB>) => Result<B, EA | EB>
  expectAssignable<Result<string | number, DataError<number | string>>>(
    ifOk("" as Result<string, DataError<number>>, (x) => fnD(Number(x))),
  );
  expectAssignable<Result<number, DataError<number | string>>>(
    ifOk(0 as Result<number, DataError<number>>, fnD),
  );
};

const testMapErr = () => {
  // (Error) => ErrorData<string>
  const fnA = (e: Error) => errData(e.message);
  // (ErrorData<boolean>) => boolean
  const fnB = (e: DataError<boolean>) => e.data;
  // () => number
  const fnC = () => 12;
  // (ErrorData<boolean>) => Result<number, DataError<string>>
  const fnD = (e: DataError<number>) =>
    e.data === 72 ? errData("I don't like that number") : e.data;

  // (A, (E) => any) => A
  expectType<"bar">(ifErr("bar", fnA));

  // (EA, (EA) => EB) => EB
  expectType<DataError<string>>(ifErr(err("foo"), fnA));

  // (E, (E) => A) => A
  expectType<boolean>(ifErr(errData(true), fnB));
  expectType<boolean>(ifErr(errData(false) as DataFooError<boolean>, fnB));

  // (Result<A, EA>, (EA) => EB) => Result<A, EB>
  expectType<Result<string, DataError<string>>>(
    ifErr(err("foo") as Result<string, Error>, fnA),
  );
  expectType<Result<string, DataError<string>>>(
    ifErr("bar" as Result<string, Error>, fnA),
  );
  expectAssignable<Result<string, DataError<string>>>(
    ifErr("bar" as Result<string, DataError<number>>, fnA),
  );

  // (Result<A, EA>, (EA) => EB) => Result<A, EB>
  expectType<Result<boolean, DataError<string>>>(
    ifErr(err() as Result<boolean, Error>, fnA),
  );
  expectType<Result<number, DataError<string>>>(
    ifErr(0 as Result<number, DataError<number>>, fnD),
  );

  // (Result<A, EA>, (EA) => Result<B, EB>) => Result<A | B, EB>
  expectType<string | boolean>(
    ifErr("not error" as Result<string, DataError<boolean>>, fnB),
  );
  expectType<string | boolean>(
    ifErr("not error" as Result<string, DataFooError<boolean>>, fnB),
  );
};

const testWithDefault = () => {
  // no default needed
  expectType<3>(orDefault(3, 0));
  // default removes Error from return type
  expectType<0 | 3>(orDefault(3 as Result<3, Error>, 0));
  expectType<number>(orDefault(3 as Result<number, Error>, 0));
  expectType<number | "oops">(
    orDefault(err() as Result<number, Error>, "oops"),
  );
  // default error type overrides value error type
  expectType<Result<number, DataError<true>>>(
    orDefault(4 as Result<number, DataError<string>>, errData(true as const)),
  );
  expectType<Result<string | number, DataError<boolean>>>(
    orDefault(
      4 as Result<number, DataError<string>>,
      errData(true) as Result<string, DataError<boolean>>,
    ),
  );
};

const testMatch = () => { };

const testConsolidate = () => {
  const w = [0] as number[];
  expectType<number[]>(consolidate(w));

  const x = [1, 2, 3, 4, err(), 6, 7, 8, 9];
  expectType<Result<number[], Error>>(consolidate(x));

  const y = [ok(true), ok(false), err(), ok("x"), ok({ a: 12 })];
  expectType<Result<Array<string | boolean | { a: number }>, Error>>(
    consolidate(y),
  );

  const xx = x as any[];
  expectType<Result<any[], Error>>(consolidate(xx));

  const xxx = x as unknown[];
  expectType<Result<unknown[], Error>>(consolidate(xxx));

  const z1 = [] as const;
  expectType<readonly []>(consolidate(z1));

  const z2 = [1] as [Result<number, Error>];
  expectType<Result<[number], Error>>(consolidate(z2));

  const z3 = [1, "q"] as [
    Result<number, DataError<string>>,
    Result<string, DataError<number>>,
  ];
  expectType<Result<[number, string], DataError<string> | DataError<number>>>(
    consolidate(z3),
  );

  const z4 = [false, 0] as const;
  expectType<readonly [false, 0]>(consolidate(z4));

  const z5 = [12, err(), err()] as const;
  expectType<Error>(consolidate(z5));

  const z6 = [1, 2, err(""), errData("")] as [
    1,
    2,
    Error,
    DataError<string> | number,
  ];
  expectType<Error | DataError<string>>(consolidate(z6));

  const z7 = [12, err(), 0] as [12, any, number | DataError<boolean>];
  expectType<Result<[12, any, number], Error | DataError<boolean>>>(
    consolidate(z7),
  );

  const z8 = [12, 3, errData(true)] as [12, any, DataError<boolean>];
  expectType<Error | DataError<boolean>>(consolidate(z8));

  const z9 = [12, 44, errData(123)] as [
    unknown,
    unknown,
    boolean | DataError<number>,
  ];
  expectType<Result<[unknown, unknown, boolean], Error | DataError<number>>>(
    consolidate(z9),
  );

  const z10 = [12, err(), errData(123)] as [
    unknown,
    unknown,
    DataError<number>,
  ];
  expectType<Error | DataError<number>>(consolidate(z10));
};

const testEncase = () => {
  const fn = (a: string, b?: number): string => {
    if (Number(a) == b) {
      throw "dang!";
    }
    return a;
  };
  const handleErr = (e: unknown) => err(e as string);

  expectType<(a: string, b?: number) => Result<string, Error>>(
    encase(fn, handleErr),
  );
};

async function testEncasePromise() {
  const willReject: Promise<boolean> = new Promise((_, reject) =>
    reject("ouch!"),
  );
  const handleErr = (e: unknown) => err(e as string);
  const handleErrData = (e: unknown) => errData(e as string);

  expectType<Promise<Result<boolean, Error>>>(
    encasePromise(willReject, handleErr),
  );
  expectType<Result<boolean, Error>>(
    await encasePromise(willReject, handleErr),
  );

  expectType<Promise<Result<boolean, DataError<string>>>>(
    encasePromise(willReject, handleErrData),
  );
  expectType<Result<boolean, DataError<string>>>(
    await encasePromise(willReject, handleErrData),
  );
  expectType<Promise<Result<boolean, DataError<unknown>>>>(
    encasePromise(willReject, errData),
  );
}
