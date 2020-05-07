import { expectType, expectAssignable, expectNotAssignable, expectError } from "tsd";
import * as ErrorValue from "../ErrorValue";
import * as Maybe from "../Maybe";
import * as AsyncData from "../AsyncData";
import {
  Result,
  Ok,
  Err,
  isOk,
  isErr,
  fromErrorable,
  fromPromise,
  toMaybe,
  toAsyncData,
  map,
  mapErr,
  mapBoth,
  withDefault,
  unwrap,
  caseOf,
  combine,
  encase
} from "../Result";

const testResult = () => {
  let x: any;
  expectType<Result<string, number>>(x as string | ErrorValue.T<number>);
  expectType<Result<44, "error">>(x as 44 | ErrorValue.T<"error">);
  expectAssignable<Result<boolean, never>>(x as boolean);
  expectAssignable<Result<boolean, { foo: 0 }>>(x as boolean);
  expectAssignable<Result<{ foo: 1 }, string>>(x as ErrorValue.T<string>);
  expectNotAssignable<Result<number, null>>(x as string);
};

const testOk = () => {
  expectType<5>(Ok(5));
  expectAssignable<5 | Err<number>>(Ok(5));
  expectType<number>(Ok<number>(5));
  expectType<null>(Ok(null));
  expectType<undefined>(Ok(undefined));
  expectType<any>(Ok(0 as any));
  expectType<unknown>(Ok(0 as unknown));
  expectType<never>(Ok(0 as never));
};

const testErr = () => {
  expectType<Err<5>>(Err(5));
  expectAssignable<Err<number>>(Err(5));
  expectType<Err<number>>(Err<number>(5));
  expectType<Err<null>>(Err(null));
  expectType<Err<undefined>>(Err(undefined));
  expectType<Err<any>>(Err(0 as any));
  expectType<Err<unknown>>(Err(0 as unknown));
  expectType<Err<never>>(Err(0 as never));
};

const testIsOk = () => {
  const x = Err(1) as Result<string, number>;
  if (isOk(x)) {
    expectType<string>(x);
  } else {
    expectType<Err<number>>(x);
  }
};

const testIsErr = () => {
  const x = Ok(false) as Result<boolean, string>;
  if (isOk(x)) {
    expectType<boolean>(x);
  } else {
    expectType<Err<string>>(x);
  }
};

const testFromErrorable = () => {};

const testFromPromise = () => {};

const testToMaybe = () => {};

const testToAsyncData = () => {};

const testMap = () => {};

const testMapErr = () => {};

const testMapBoth = () => {};

const testWithDefault = () => {};

const testUnwrap = () => {};

const testCaseOf = () => {};

const testCombine = () => {};

const testEncas = () => {
  const fn = (a: string, b?: number): string => {
    if (Number(a) == b) {
      throw "dang!";
    }
    return a;
  };

  expectType<(a: string, b?: number) => Result<string, unknown>>(encase(fn));
};
