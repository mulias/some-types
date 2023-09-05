import { expectType, expectError } from "tsd";
import { Branded, BaseOf, BrandOf } from "../lib/Branded";

declare const UUIDBrand: unique symbol;
type UUID = Branded<string, typeof UUIDBrand>;

declare const CoolBrand: unique symbol;
type Cool<T> = Branded<T, typeof CoolBrand>;

expectType<string>(null as any as BaseOf<UUID>);
expectType<typeof UUIDBrand>(null as any as BrandOf<UUID>);
expectError(null as any as BrandOf<string>);

expectType<string>(null as any as BaseOf<Cool<UUID>>);
expectType<typeof UUIDBrand | typeof CoolBrand>(
  null as any as BrandOf<Cool<UUID>>,
);

const requireUUID = (uuid: UUID) => uuid;
const requireCool = <T extends Cool<unknown>>(val: T) => val;
const requireCoolUUID = (uuid: Cool<UUID>) => uuid;

const uuid = "3da74402-afe5-48aa-93e4-3399a2d8c0e2" as UUID;
const coolUuid = "6778379b-3b2d-4ffe-98f5-ef805ee26997" as Cool<UUID>;
const coolNum = 1729 as Cool<number>;

expectType<UUID>(requireUUID(uuid));
expectType<Cool<UUID>>(requireCoolUUID(coolUuid));
expectType<Cool<UUID>>(requireCool(coolUuid));
expectType<Cool<number>>(requireCool(coolNum));
expectError(requireUUID("foo"));
expectError(requireUUID(coolNum));
expectError(requireCool(uuid));
expectError(requireCoolUUID(coolNum));
