import { Tuple } from "./namespace";

// Namespaces and Types
export { Tuple } from "./namespace";
export { Empty } from "./Empty/namespace";
export { Single } from "./Single/namespace";
export { Pair } from "./Pair/namespace";
export { Triple } from "./Triple/namespace";
export {
  // Constructors
  tuple,
  empty,
  single,
  pair,
  triple,
  of,
  // Typeguards
  isTuple,
  isEmpty,
  isSingle,
  isPair,
  isTriple,
  isType,
  // Conversions
  fromArray,
  fromEmptyArray,
  fromSingleArray,
  fromPairArray,
  fromTripleArray,
  coerceEmpty,
  coerceSingle,
  coercePair,
  coerceTriple,
  coerce,
  // Operations
  first,
  second,
  third,
  head,
  tail,
  last,
  front,
  map,
  mapFirst,
  mapSecond,
  mapThird,
  reverse,
  zip,
  unzip,
};

const {
  tuple,
  empty,
  single,
  pair,
  triple,
  of,
  isTuple,
  isEmpty,
  isSingle,
  isPair,
  isTriple,
  isType,
  fromArray,
  fromEmptyArray,
  fromSingleArray,
  fromPairArray,
  fromTripleArray,
  coerceEmpty,
  coerceSingle,
  coercePair,
  coerceTriple,
  coerce,
  first,
  second,
  third,
  head,
  tail,
  last,
  front,
  map,
  mapFirst,
  mapSecond,
  mapThird,
  reverse,
  zip,
  unzip,
} = Tuple;
