export {
  // Namespaces and Types
  Result,
  Ok,
  Err,
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
  match,
  consolidate,
  encase,
  encaseWithData,
  encasePromise,
  encasePromiseWithData,
};

import { Result } from "./namespace";
import { Ok } from "./Ok/namespace";
import { Err } from "./Err/namespace";
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
  match,
  consolidate,
  encase,
  encaseWithData,
  encasePromise,
  encasePromiseWithData,
} = Result;
