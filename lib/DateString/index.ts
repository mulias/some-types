export {
  // Namespace and Type
  DateString,
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

import { DateString } from "./namespace";
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
