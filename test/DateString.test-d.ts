import { expectType } from "tsd";
import { DateString, dateString } from "../lib/DateString";

expectType<DateString>(
  dateString({
    year: 1970,
    monthIndex: 0,
    day: 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }),
);
