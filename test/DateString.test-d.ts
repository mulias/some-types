import { expectType } from "tsd";
import * as Maybe from "../Maybe";
import {
  DateString,
  T,
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  toDate,
  map
} from "../DateString";

expectType<DateTimeString | undefined>(
  Maybe.map(DateTimeString, {
    year: 1,
    month: 1,
    date: 1,
    hours: 1,
    minutes: 1,
    seconds: 1
  })
);
