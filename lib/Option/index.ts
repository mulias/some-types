export {
  // Namespaces and Types
  Option,
  Some,
  None,
  // Constructors
  some,
  of,
  none,
  // Typeguards
  isSome,
  isNone,
  // Conversions
  fromResult,
  fromRemoteData,
  fromNullable,
  fromPredicate,
  fromFalsy,
  toNullable,
  toResult,
  toRemoteData,
  coerceSome,
  coerceNone,
  // Operations
  ifSome,
  ifNone,
  orDefault,
  match,
  consolidate,
  encase,
  encasePromise,
};

import { Option } from "./namespace";
import { Some } from "./Some/namespace";
import { None } from "./None/namespace";
const {
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
  coerceSome,
  coerceNone,
  ifSome,
  ifNone,
  orDefault,
  match,
  consolidate,
  encase,
  encasePromise,
} = Option;
