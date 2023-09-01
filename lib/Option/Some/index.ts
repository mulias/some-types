import { Some } from "./namespace";

export { Some } from "./namespace";
export {
  // Constructors
  of,
  // Typeguards
  isType,
  // Conversions
  coerce,
  // Operations
  ifType,
};

const { of, isType, coerce, ifType } = Some;
