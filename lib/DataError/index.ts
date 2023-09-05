export {
  // Namespace and Type
  DataError,
  // Constructors
  dataError,
  of,
  // Typeguards
  isDataError,
  isType,
  // Conversions
  fromError,
  // Operations
  map,
};

import { DataError } from "./namespace";
const { dataError, of, isDataError, isType, fromError, map } = DataError;
