import type {
  BSON,
  BaseObjectSchema,
  Dictionary,
  PropertySchema as PropertySchemaR,
  PropertyTypeName,
} from 'realm';
import {JSONConstraint} from 'types/global';

interface PropertySchema<N extends PropertyTypeName> extends PropertySchemaR {
  type: N;
  objectType?: SchemaName;
}
type PropertySchemaType<N extends PropertyTypeName, T> =
  | (T extends undefined ? OptionalPropertyTypeName<N> : N)
  | PropertySchema<N>;

type OptionalPropertyTypeName<T extends PropertyTypeName> = `${T}?`;

type UUIDPropertyTypeName = 'uuid';
type ObjectIdPropertyTypeName = 'objectId';
type StringPropertyTypeName = 'string';
type NumberPropertyTypeName = 'int' | 'float' | 'double' | 'decimal128';
type BooleanPropertyTypeName = 'bool';
type DatePropertyTypeName = 'date';
type ArrayPropertyTypeName = 'list';
type ObjectPropertyTypeName = 'object' | 'linkingObjects';
type SetPropertyTypeName = 'set';
type ArrayBufferPropertyTypeName = 'data';
type DictionaryPropertyTypeName = 'dictionary';
type OtherPropertyTypeName = 'mixed';

type GetPropertySchemaType<T> = T extends undefined
  ? OptionalPropertyTypeName<
      | StringPropertyTypeName
      | NumberPropertyTypeName
      | BooleanPropertyTypeName
      | DatePropertyTypeName
      | ObjectPropertyTypeName
      | DictionaryPropertyTypeName
    >
  : T extends BSON.UUID
  ? PropertySchemaType<UUIDPropertyTypeName, T>
  : T extends BSON.ObjectId
  ? PropertySchemaType<ObjectIdPropertyTypeName, T>
  : T extends string
  ? PropertySchemaType<StringPropertyTypeName, T>
  : T extends number
  ? PropertySchemaType<NumberPropertyTypeName, T>
  : T extends boolean
  ? PropertySchemaType<BooleanPropertyTypeName, T>
  : T extends Date
  ? PropertySchemaType<DatePropertyTypeName, T>
  : T extends Array<any>
  ? PropertySchemaType<ArrayPropertyTypeName, T>
  : T extends JSONConstraint
  ? PropertySchemaType<ObjectPropertyTypeName, T>
  : T extends Set<any>
  ? PropertySchemaType<SetPropertyTypeName, T>
  : T extends Dictionary
  ? PropertySchemaType<DictionaryPropertyTypeName, T>
  : T extends ArrayBuffer
  ? PropertySchemaType<ArrayBufferPropertyTypeName, T>
  : PropertySchemaType<OtherPropertyTypeName, T>;

interface Schema<T extends JSONConstraint> {
  name: LSSchemaName | SchemaName;
  primaryKey?: keyof T;
  properties: {
    [K in keyof T]-?: GetPropertySchemaType<T[K]>;
  };
}

export function createObjectSchema<T extends JSONConstraint>(
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
