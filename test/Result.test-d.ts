import { expectType, expectAssignable, expectNotAssignable, expectError } from "tsd";
import * as ErrorData from "../ErrorData";
import * as Maybe from "../Maybe";
import * as AsyncData from "../AsyncData";
import {
  Result,
  Ok,
  Err,
  ok,
  err,
  errData,
  isOk,
  isErr,
  toMaybe,
  toAsyncData,
  map,
  mapErr,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase,
  encasePromise
} from "../Result";

const testResult = () => {
  let x: any;
  expectType<Result<string, ErrorData.T<number>>>(x as string | ErrorData.T<number>);
  expectType<Result<44, ErrorData.T<"error">>>(x as 44 | ErrorData.T<"error">);
  expectAssignable<Result<boolean, never>>(x as boolean);
  expectAssignable<Result<boolean, ErrorData.T<{ foo: 0 }>>>(x as boolean);
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
  expectType<Err<ErrorData.T<5>>>(errData(5));
  expectType<Err<ErrorData.T<number>>>(errData<number>(5));
  expectAssignable<Err<ErrorData.T<number>>>(errData(5));
  expectType<ErrorData.T<null>>(errData(null));
  expectType<ErrorData.T<undefined>>(errData(undefined));
  expectType<ErrorData.T<any>>(errData(0 as any));
  expectType<ErrorData.T<unknown>>(errData(0 as unknown));
  expectType<ErrorData.T<never>>(errData(0 as never));
};

const testIsOk = () => {
  const x = errData(1) as Result<string, ErrorData.T<number>>;
  if (isOk(x)) {
    expectType<string>(x);
  } else {
    expectType<Err<ErrorData.T<number>>>(x);
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

const testToMaybe = () => {};

const testToAsyncData = () => {};

const testMap = () => {
  const fnA = (x: number) => x + 1;
  expectType<number>(map(0, fnA));
  expectType<Error>(map(err(), fnA));
  expectType<Result<number, Error>>(map(0 as Result<number, Error>, fnA));

  const fnB = (x: number) => errData("I don't like numbers");
  expectType<ErrorData.T<string>>(map(0, fnB));
  expectType<Error>(map(err(), fnB));
  expectAssignable<ErrorData.T<number | string>>(
    map(0 as Result<number, ErrorData.T<number>>, fnB)
  );

  const fnC = (x: number) => (x === 72 ? errData("I don't like that number") : x);
  expectAssignable<Result<number, ErrorData.T<number | string>>>(
    map(0 as Result<number, ErrorData.T<number>>, fnC)
  );
};

const testMapErr = () => {
  const fnA = (e: Error) => errData(e.message);
  expectType<ErrorData.T<string>>(mapErr(err("foo"), fnA));
  expectType<Result<string, ErrorData.T<string>>>(mapErr(err("foo") as Result<string, Error>, fnA));
  expectType<"bar">(mapErr("bar", fnA));
  expectType<Result<string, ErrorData.T<string>>>(mapErr("bar" as Result<string, Error>, fnA));
};

const testWithDefault = () => {
  // no default needed
  expectType<3>(withDefault(3, 0));
  // default removes Error from return type
  expectType<0 | 3>(withDefault(3 as Result<3, Error>, 0));
  expectType<number>(withDefault(3 as Result<number, Error>, 0));
  expectType<number | "oops">(withDefault(err() as Result<number, Error>, "oops"));
  // default error type overrides value error type
  expectType<Result<number, ErrorData.T<true>>>(
    withDefault(4 as Result<number, ErrorData.T<string>>, errData(true))
  );
  expectType<Result<string | number, ErrorData.T<boolean>>>(
    withDefault(
      4 as Result<number, ErrorData.T<string>>,
      errData(true) as Result<string, ErrorData.T<boolean>>
    )
  );
};

const testUnwrap = () => {};

const testCaseOf = () => {};

const testCombine = () => {};

const testEncase = () => {
  const fn = (a: string, b?: number): string => {
    if (Number(a) == b) {
      throw "dang!";
    }
    return a;
  };
  const handleErr = (e: unknown) => err(e as string);

  expectType<(a: string, b?: number) => Result<string, Error>>(encase(fn, handleErr));
};

async function testEncasePromise() {
  const willReject: Promise<boolean> = new Promise((_, reject) => reject("ouch!"));
  const handleErr = (e: unknown) => err(e as string);
  const handleErrData = (e: unknown) => errData(e as string);

  expectType<Promise<Result<boolean, Error>>>(encasePromise(willReject, handleErr));
  expectType<Result<boolean, Error>>(await encasePromise(willReject, handleErr));

  expectType<Promise<Result<boolean, ErrorData.T<string>>>>(
    encasePromise(willReject, handleErrData)
  );
  expectType<Result<boolean, ErrorData.T<string>>>(await encasePromise(willReject, handleErrData));
  expectType<Promise<Result<boolean, ErrorData.T<unknown>>>>(encasePromise(willReject, errData));
}
