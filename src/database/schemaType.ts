import type {BaseObjectSchema} from 'realm';

interface PropertySchema<T> {
  type: T;
  objectType: SchemaName;
  property?: string;
  optional?: boolean;
  indexed?: boolean | 'full-text';
  mapTo?: string;
  default?: unknown;
}

type BooleanPropertyTypeName = 'bool';
type NumberPropertyTypeName = 'int' | 'float' | 'double' | 'decimal128';
type StringPropertyTypeName = 'string' | 'uuid' | 'objectId';
type DatePropertyTypeName = 'date';
type OtherPropertyTypeName =
  | 'object'
  | 'list'
  | 'data'
  | 'linkingObjects'
  | 'dictionary'
  | 'set'
  | 'mixed';

type GetPropertyTypeName<T> = T extends string
  ? StringPropertyTypeName | PropertySchema<StringPropertyTypeName>
  : T extends number
  ? NumberPropertyTypeName | PropertySchema<NumberPropertyTypeName>
  : T extends boolean
  ? BooleanPropertyTypeName | PropertySchema<BooleanPropertyTypeName>
  : T extends Date
  ? DatePropertyTypeName | PropertySchema<DatePropertyTypeName>
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
