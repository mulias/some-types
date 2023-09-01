import { expectType } from "tsd";
import { ValidDate } from "../lib";
import { Timestamp, timestamp, now } from "../lib/Timestamp";

expectType<Timestamp>(
  timestamp({
    year: 1970,
    monthIndex: 0,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }),
);

expectType<Timestamp>(Timestamp.map(now(), (_d: ValidDate) => ValidDate.now()));
expectType<Timestamp>(
  Timestamp.map(timestamp(NaN), (_d: Date) => ValidDate.now()),
);
expectType<Timestamp>(Timestamp.map(timestamp(NaN), (d: Date) => d));
expectType<Timestamp>(Timestamp.map(now(), (d: Date) => d));
