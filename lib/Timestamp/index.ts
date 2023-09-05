export {
  // Namespace and Type
  Timestamp,
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

import { Timestamp } from "./namespace";
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
