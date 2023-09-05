export {
  // Namespace and Type
  NonEmptyArray,
  // Constructors
  nonEmptyArray,
  of,
  // Typeguards
  isNonEmptyArray,
  isType,
  // Conversions
  fromArray,
  coerceNonEmptyArray,
  coerce,
  // Operations
  first,
  last,
  front,
  tail,
  map,
  reverse,
  concat,
  sort,
};

import { NonEmptyArray } from "./namespace";
const {
  nonEmptyArray,
  of,
  isNonEmptyArray,
  isType,
  fromArray,
  coerceNonEmptyArray,
  coerce,
  first,
  last,
  front,
  tail,
  map,
  reverse,
  concat,
  sort,
} = NonEmptyArray;
