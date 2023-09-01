import { expectType } from "tsd";
import { Tuple } from "../lib/Tuple";

expectType<Tuple.Empty>(Tuple.of());
expectType<Tuple.Single<string>>(Tuple.of("a"));
expectType<Tuple.Pair<1, true>>(Tuple.of(1, true));
expectType<Tuple.Triple<undefined, null, typeof NaN>>(
  Tuple.of(undefined, null, NaN),
);

expectType<readonly []>([] as Tuple);
expectType<readonly []>([] as Tuple<never>);
expectType<readonly []>([] as Tuple<never, never>);
expectType<readonly []>([] as Tuple<never, never, never>);
expectType<readonly [number]>([1] as Tuple<number>);
expectType<readonly [number]>([1] as Tuple<number, never>);
expectType<readonly [number]>([1] as Tuple<number, never, never>);
expectType<readonly [number, string]>([1, "a"] as Tuple<number, string>);
expectType<readonly [number, string]>([1, "a"] as Tuple<number, string, never>);
expectType<readonly [number, string, true]>([1, "a", true] as Tuple<
  number,
  string,
  true
>);
expectType<readonly [never, string, true]>([1 as never, "a", true] as Tuple<
  never,
  string,
  true
>);
expectType<readonly [number, never, true]>([1, "a" as never, true] as Tuple<
  number,
  never,
  true
>);
