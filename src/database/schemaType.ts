import type {BaseObjectSchema, PropertySchema, PropertyTypeName} from 'realm';

interface Schema<T extends Record<string, any>> {
  name: LSSchemaName | SchemaName;
  primaryKey?: keyof T;
  properties: {
    [K in keyof T]: PropertyTypeName | PropertySchema;
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
