import { Option } from "./namespace";

// Namespaces and Types
export { Option } from "./namespace";
export { Some } from "./Some/namespace";
export { None } from "./None/namespace";
export {
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
  caseOf,
  consolidate,
  encase,
  encasePromise,
};

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
  caseOf,
  consolidate,
  encase,
  encasePromise,
} = Option;
