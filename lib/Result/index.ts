import { Result } from "./namespace";

// Namespaces and Types
export { Result } from "./namespace";
export { Ok } from "./Ok/namespace";
export { Err } from "./Err/namespace";
export {
  // Constructors
  ok,
  of,
  err,
  errData,
  // Typeguards
  isOk,
  isErr,
  // Conversions
  fromOption,
  fromRemoteData,
  toOption,
  toRemoteData,
  coerceOk,
  coerceErr,
  // Operations
  ifOk,
  ifErr,
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
  ok,
  err,
  errData,
  of,
  isOk,
  isErr,
  fromOption,
  fromRemoteData,
  toOption,
  toRemoteData,
  coerceOk,
  coerceErr,
  ifOk,
  ifErr,
  orDefault,
  orThrow,
  caseOf,
  consolidate,
  encase,
  encaseWithData,
  encasePromise,
  encasePromiseWithData,
} = Result;
