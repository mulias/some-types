import { Err } from "./namespace";

export { Err } from "./namespace";
export {
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

const { of, withData, isType, coerce, ifType } = Err;
