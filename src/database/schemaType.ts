import type {
  BaseObjectSchema,
  PropertySchema as PropertySchemaR,
  PropertyTypeName,
} from 'realm';

interface PropertySchema<T extends PropertyTypeName> extends PropertySchemaR {
  type: T;
  objectType?: SchemaName;
}

type OptionalPropertyTypeName<T extends string> = `${T}?`;

type StringPropertyTypeName = 'string' | 'uuid' | 'objectId';
type NumberPropertyTypeName = 'int' | 'float' | 'double' | 'decimal128';
type BooleanPropertyTypeName = 'bool';
type DatePropertyTypeName = 'date';
type ArrayPropertyTypeName = 'list';
type OtherPropertyTypeName =
  | 'object'
  | 'data'
  | 'linkingObjects'
  | 'dictionary'
  | 'set'
  | 'mixed';

type GetPropertyTypeName<T> = T extends undefined
  ? OptionalPropertyTypeName<
      | StringPropertyTypeName
      | NumberPropertyTypeName
      | BooleanPropertyTypeName
      | DatePropertyTypeName
    >
  : T extends string
  ? StringPropertyTypeName | PropertySchema<StringPropertyTypeName>
  : T extends number
  ? NumberPropertyTypeName | PropertySchema<NumberPropertyTypeName>
  : T extends boolean
  ? BooleanPropertyTypeName | PropertySchema<BooleanPropertyTypeName>
  : T extends Date
  ? DatePropertyTypeName | PropertySchema<DatePropertyTypeName>
  : T extends any[]
  ? ArrayPropertyTypeName | PropertySchema<ArrayPropertyTypeName>
  : OtherPropertyTypeName | PropertySchema<OtherPropertyTypeName>;

interface Schema<T extends Record<string, any>> {
  name: LSSchemaName | SchemaName;
  primaryKey?: keyof T;
  properties: {
    [K in keyof T]: GetPropertyTypeName<T[K]>;
  };
}

export function createObjectSchema<T extends Record<string, any>>(
  schema: Schema<T> & BaseObjectSchema,
) {
  return schema;
}

export enum LSSchemaName {
  LSItem = 'LSItem',
  LSUserInfo = 'LSUserInfo',
}

export enum SchemaName {
  Color = 'Color',
  AssetType = 'AssetType',
  Currency = 'Currency',
  History = 'History',
  Ledger = 'Ledger',
}
