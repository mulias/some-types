import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from "tsd";
import { DataError } from "../lib/DataError";
import {
  RemoteData,
  NotAsked,
  Loading,
  Success,
  Failure,
  notAsked,
  loading,
  success,
  failure,
  failureData,
  ifSuccess,
  consolidate,
} from "../lib/RemoteData";

const testIfSuccess = () => {
  expectType<Error>(ifSuccess(failure("woops"), (x) => x + 1));
  expectType<DataError<number>>(ifSuccess(failureData(1), (x) => x + 1));
  expectType<DataError<string>>(
    ifSuccess(failureData("gosh dang"), (x) => x + 1),
  );
  expectType<NotAsked>(ifSuccess(notAsked, (x) => x + 1));
  expectType<Loading>(ifSuccess(loading, (x) => x + 1));
  expectType<number>(ifSuccess(success(1), (x) => x + 1));
  expectType<RemoteData<number, DataError<string>>>(
    ifSuccess(loading as RemoteData<number, DataError<string>>, (x) => x + 1),
  );
  expectType<RemoteData<string, DataError<string>>>(
    ifSuccess(loading as RemoteData<number, DataError<string>>, String),
  );
  expectType<RemoteData<never, DataError<string> | DataError<number>>>(
    ifSuccess(loading as RemoteData<string, DataError<number>>, failureData),
  );
  expectType<RemoteData<boolean, DataError<string> | DataError<number>>>(
    ifSuccess(
      loading as RemoteData<number, DataError<number>>,
      (x) => x as any as boolean | DataError<string>,
    ),
  );
};

const testConsolidate = () => {
  const w = [0] as number[];
  expectType<number[]>(consolidate(w));

  const x = [1, 2, 3, 4, notAsked, 6, 7, 8, 9];
  expectType<RemoteData<number[], never>>(consolidate(x));

  const y = [
    success(true),
    success(false),
    failure(),
    success("x"),
    success({ a: 12 }),
  ];
  expectType<RemoteData<Array<string | boolean | { a: number }>, Error>>(
    consolidate(y),
  );

  const xx = x as any[];
  expectType<RemoteData<any[], Error>>(consolidate(xx));

  const xxx = x as unknown[];
  expectType<RemoteData<unknown[], Error>>(consolidate(xxx));

  const z1 = [] as const;
  expectType<readonly []>(consolidate(z1));

  const z2 = [1] as [RemoteData<number, Error>];
  expectType<RemoteData<[number], Error>>(consolidate(z2));

  const z3 = [1, "q"] as [
    RemoteData<number, Error>,
    RemoteData<string, DataError<boolean>>,
  ];
  expectType<RemoteData<[number, string], Error | DataError<boolean>>>(
    consolidate(z3),
  );

  const z4 = [false, 0] as const;
  expectType<readonly [false, 0]>(consolidate(z4));

  const z5 = [12, loading, notAsked] as const;
  expectType<NotAsked | Loading>(consolidate(z5));

  const z6 = [1, 2, failure(), loading] as [1, 2, Error, Loading | number];
  expectType<Error | Loading>(consolidate(z6));

  const z7 = [12, loading, failureData(true)] as [
    12,
    any,
    number | DataError<boolean>,
  ];
  expectType<RemoteData<[12, any, number], Error | DataError<boolean>>>(
    consolidate(z7),
  );

  const z8 = [12, loading, failureData(true)] as [12, any, DataError<boolean>];
  expectType<Error | DataError<boolean>>(consolidate(z8));

  const z9 = [12, loading, failureData(123)] as [
    unknown,
    unknown,
    boolean | DataError<number>,
  ];
  expectType<
    RemoteData<[unknown, unknown, boolean], Error | DataError<number>>
  >(consolidate(z9));

  const z10 = [12, loading, failureData(123)] as [
    unknown,
    unknown,
    DataError<number>,
  ];
  expectType<Error | DataError<number>>(consolidate(z10));
};
