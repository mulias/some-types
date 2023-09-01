import { Timestamp } from "./namespace";

// Namespace and Type
export { Timestamp } from "./namespace";
export {
  // Constructors
  timestamp,
  parse,
  of,
  now,
  // Typeguards
  isTimestamp,
  isType,
  // Conversions
  toDate,
  toValidDate,
  toDateString,
  localFields,
  utcFields,
  coerceTimestamp,
  coerce,
  // Operations
  map,
};

const {
  timestamp,
  parse,
  of,
  now,
  isTimestamp,
  isType,
  toDate,
  toValidDate,
  toDateString,
  localFields,
  utcFields,
  coerceTimestamp,
  coerce,
  map,
} = Timestamp;
