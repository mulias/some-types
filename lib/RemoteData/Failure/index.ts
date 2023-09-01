import { Failure } from "./namespace";

export { Failure } from "./namespace";
export {
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

const { of, withData, isType, coerce, ifType } = Failure;
