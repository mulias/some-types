import { expectType } from "tsd";
import { ValidDate } from "../lib/ValidDate";

expectType<ValidDate>(ValidDate.of(new Date()));
expectType<ValidDate | undefined>(ValidDate.parse(0));
expectType<ValidDate>(ValidDate.now());
