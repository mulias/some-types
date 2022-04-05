export { Opaque, T };

type Opaque<A, Brand> = A & { readonly __opaque__: Brand };

type T<A, Brand> = Opaque<A, Brand>;
