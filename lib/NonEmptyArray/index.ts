import { NonEmptyArray } from "./namespace";

// Namespace and Type
export { NonEmptyArray } from "./namespace";
export {
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
