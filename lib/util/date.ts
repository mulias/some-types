/** Constituent date/time parts of a `Date`, in the local timezone. */
export type LocalDateFields = {
  year: number;
  monthIndex: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  timezoneOffsetMinutes: number;
};

/** Constituent date/time parts of a `Date`, in UTC. */
export type UTCDateFields = {
  year: number;
  monthIndex: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

/** Fields to construct a `Date`. */
export type NewDateArgs = {
  year: number;
  monthIndex: number;
  day: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  utc?: boolean;
};

export function newDate(d: string | number | Date | NewDateArgs): Date {
  if (d instanceof Date || typeof d === "string" || typeof d === "number") {
    return new Date(d);
  } else {
    const {
      year,
      monthIndex,
      day,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
      utc = false,
    } = d;

    return utc
      ? new Date(
          Date.UTC(
            year,
            monthIndex,
            day,
            hours,
            minutes,
            seconds,
            milliseconds,
          ),
        )
      : new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds);
  }
}

export const getUTCDateFields = (d: Date): UTCDateFields => {
  const year = d.getUTCFullYear();
  const monthIndex = d.getUTCMonth();
  const day = d.getUTCDate();
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const seconds = d.getUTCSeconds();
  const milliseconds = d.getUTCMilliseconds();

  return { year, monthIndex, day, hours, minutes, seconds, milliseconds };
};

export const getLocalDateFields = (d: Date): LocalDateFields => {
  const year = d.getFullYear();
  const monthIndex = d.getMonth();
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const milliseconds = d.getMilliseconds();
  const timezoneOffsetMinutes = d.getTimezoneOffset();

  return {
    year,
    monthIndex,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
    timezoneOffsetMinutes,
  };
};
