// from https://github.com/millsp/ts-toolbelt/blob/master/sources/Any/Equals.ts
export type Equals<A1, A2> = (<A>() => A extends A2 ? 1 : 0) extends <
  A,
>() => A extends A1 ? 1 : 0
  ? 1
  : 0;

export type IsAnyOrUnknown<A> = Equals<A, any> extends 0
  ? Equals<A, unknown>
  : 1;

export type IsNever<A> = Equals<A, never>;

export type NonAnyOrUnknownElements<T extends ReadonlyArray<any>> = {
  [k in keyof T]: IsAnyOrUnknown<T[k]> extends 0 ? T[k] : never;
}[number];

/* All Error types present in an array.  If any array elemnt has the type `any`
 * or `unknown` then make sure the return type includes `Error`, since we can't
 * garentee the type doesn't include an error.
 */
export type ErrorElements<T extends ReadonlyArray<any>> =
  | Extract<NonAnyOrUnknownElements<T>, Error>
  | (IsAnyOrUnknown<T[number]> extends 1 ? Error : never);

/* Construct a type with the properties of T except for those in type K. */
export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
