import { expectType } from "tsd";
import { DataError, dataError } from "../lib/DataError";

expectType<DataError<number>>(dataError(404, "not found"));
expectType<DataError<boolean>>(new DataError(false));
