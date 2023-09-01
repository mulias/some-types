import { ValidDate } from "./namespace";

// Namespace and Type
export { ValidDate } from "./namespace";
export {
  // Constructors
  validDate,
  of,
  now,
  // Typeguards
  isValidDate,
  isType,
  // Conversions
  fromDate,
  toDate,
  asDate,
  coerceValidDate,
  coerce,
  // Operations
  map,
};

const {
  validDate,
  of,
  now,
  isValidDate,
  isType,
  fromDate,
  toDate,
  asDate,
  coerceValidDate,
  coerce,
  map,
} = ValidDate;
