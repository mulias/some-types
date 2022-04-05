import { expectType } from "tsd";
import * as Maybe from "../Maybe";
import {
  DateString,
  DateTimeString,
  DateOnlyString,
  DateMonthString,
  T,
  dateString,
  dateTimeString,
  dateOnlyString,
  dateMonthString,
  of,
  isDateString,
  isDateTimeString,
  isDateOnlyString,
  isDateMonthString,
  toDate,
  map
} from "../DateString";

expectType<DateTimeString | undefined>(
  Maybe.map({ year: 1, month: 1, date: 1, hours: 1, minutes: 1, seconds: 1 }, dateTimeString)
);
