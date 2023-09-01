import { DateString } from "./namespace";

// Namespace and Type
export { DateString } from "./namespace";
export {
  // Constructors
  dateString,
  parse,
  of,
  now,
  // Typeguards
  isDateString,
  isType,
  // Conversions
  toDate,
  toValidDate,
  toTimestamp,
  localFields,
  utcFields,
  coerceDateString,
  coerce,
  // Operations
  map,
};

const {
  dateString,
  parse,
  of,
  now,
  isDateString,
  isType,
  toDate,
  toValidDate,
  toTimestamp,
  localFields,
  utcFields,
  coerceDateString,
  coerce,
  map,
} = DateString;
