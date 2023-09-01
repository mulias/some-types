import { ReadonlyDate } from "./namespace";

// Namespace and Type
export { ReadonlyDate } from "./namespace";
export {
  // Constructors
  readonlyDate,
  of,
  now,
  // Conversions
  fromDate,
  toDate,
  asDate,
};

const { readonlyDate, of, now, fromDate, toDate, asDate } = ReadonlyDate;
