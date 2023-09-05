export {
  // Namespace and Type
  Err,
  // Constructors
  of,
  withData,
  // Typeguards
  isType,
  // Conversions
  coerce,
  // Operations
  ifType,
};

import { Err } from "./namespace";
const { of, withData, isType, coerce, ifType } = Err;
