export {
  // Namespace and Type
  Failure,
  // Constructors
  of,
  withData,
  // Type guards
  isType,
  // Conversions
  coerce,
  // Operations
  ifType,
};

import { Failure } from "./namespace";
const { of, withData, isType, coerce, ifType } = Failure;
