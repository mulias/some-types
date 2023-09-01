import { RemoteData } from "./namespace";

// Namespaces and Types
export { RemoteData } from "./namespace";
export { NotAsked } from "./NotAsked/namespace";
export { Loading } from "./Loading/namespace";
export { Success } from "./Success/namespace";
export { Failure } from "./Failure/namespace";
export {
  // Constructors
  notAsked,
  loading,
  success,
  of,
  failure,
  failureData,
  // Typeguards
  isNotAsked,
  isLoading,
  isSuccess,
  isFailure,
  isCompleted,
  // Conversions
  fromOption,
  fromResult,
  toOption,
  toResult,
  coerceNotAsked,
  coerceLoading,
  coerceSuccess,
  coerceFailure,
  // Operations
  ifNotAsked,
  ifLoading,
  ifSuccess,
  ifFailure,
  orDefault,
  orThrow,
  caseOf,
  consolidate,
  encase,
  encaseWithData,
  encasePromise,
  encasePromiseWithData,
};

const {
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
  fromOption,
  fromResult,
  toOption,
  toResult,
  coerceNotAsked,
  coerceLoading,
  coerceSuccess,
  coerceFailure,
  ifNotAsked,
  ifLoading,
  ifSuccess,
  ifFailure,
  orDefault,
  orThrow,
  caseOf,
  consolidate,
  encase,
  encaseWithData,
  encasePromise,
  encasePromiseWithData,
} = RemoteData;
