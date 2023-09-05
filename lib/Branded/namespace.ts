/**
 *
 * Type: `Branded` creates a new branded type, meaning a type that enhances a
 * `Base` type with additional compile-time meaning. Branded types can still be
 * used in place of their base type, but the base type can't be used when the
 * branded type is required. The provided `Brand` should be a unique symbol
 * which is not used anywhere else.
 *
 */
export type Branded<Base, Brand extends symbol> = Base & {
  readonly [K in Brand]: typeof Branded.brand;
} & {
  readonly [Branded.base]: Branded.BaseOf<Base>;
};

/**
 *
 * Namespace: The `Branded` namespace contains the symbols used by branded
 * types, as well as utility types.
 *
 */
export namespace Branded {
  /** Subtype shared by all branded types. */
  export type AnyBranded = { readonly [base]: any };

  /**
   * Get the base from a branded type. If `T` is not branded then the
   * returned type is `T`.
   */
  export type BaseOf<T> = T extends { readonly [base]: infer Base } ? Base : T;

  /** Get the brand from a branded type. `T` must be a branded type. */
  export type BrandOf<T extends AnyBranded> = {
    [key in keyof T]-?: T[key] extends typeof brand ? key : never;
  }[keyof T];

  /**
   * Unique symbol used as the property key for witnessing the underlying type
   * that has been branded. Note that `base` does not exist at runtime and
   * should not be used as a value.
   */
  export declare const base: unique symbol;

  /**
   * Unique symbol used as the property value for each type brand. Note that
   * `brand` does not exist at runtime and should not be used as a value.
   */
  export declare const brand: unique symbol;
}
