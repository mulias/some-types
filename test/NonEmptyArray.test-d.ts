import { expectType } from "tsd";
import { NonEmptyArray } from "../lib/NonEmptyArray";

expectType<NonEmptyArray<number>>(NonEmptyArray.of(1, [2, 3, 4, 5]));
