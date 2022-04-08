import { expectType, expectAssignable, expectNotAssignable, expectError } from "tsd";
import * as DataError from "../DataError";
import {
  AsyncData,
  NotAsked,
  Loading,
  Success,
  Failure,
  T,
  notAsked,
  loading,
  success,
  failure,
  failureData,
  of,
  isNotAsked,
  isLoading,
  isSuccess,
  isFailure,
  isCompleted,
  fromMaybe,
  fromResult,
  toMaybe,
  toResult,
  map,
  mapFailure,
  unwrap,
  caseOf,
  combine,
  encase,
  encasePromise
} from "../AsyncData";

const testMap = () => {
  expectType<Error>(map(failure("woops"), (x) => x + 1));
  expectType<DataError.T<number>>(map(failureData(1), (x) => x + 1));
  expectType<DataError.T<string>>(map(failureData("gosh dang"), (x) => x + 1));
  expectType<NotAsked>(map(notAsked, (x) => x + 1));
  expectType<Loading>(map(loading, (x) => x + 1));
  expectType<number>(map(success(1), (x) => x + 1));
  expectType<AsyncData<number, DataError.T<string>>>(
    map(loading as AsyncData<number, DataError.T<string>>, (x) => x + 1)
  );
  expectType<AsyncData<string, DataError.T<string>>>(
    map(loading as AsyncData<number, DataError.T<string>>, String)
  );
  expectType<AsyncData<never, DataError.T<string> | DataError.T<number>>>(
    map(loading as AsyncData<string, DataError.T<number>>, failureData)
  );
  expectType<AsyncData<boolean, DataError.T<string> | DataError.T<number>>>(
    map(
      loading as AsyncData<number, DataError.T<number>>,
      (x) => x as any as boolean | DataError.T<string>
    )
  );
};
