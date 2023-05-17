import type {ObjectSchemaProperty, PropertyType} from 'realm';

interface Schema<T extends Record<string, any>> {
  name: string;
  embedded?: boolean;
  asymmetric?: boolean;
  primaryKey?: keyof T;
  properties: {
    [K in keyof T]: ObjectSchemaProperty | PropertyType;
  };
}

export function createObjectSchema<T extends Record<string, any>>(
  schema: Schema<T>,
) {
  return schema;
}

export enum SchemaName {
  Color = 'Color',
  AssetType = 'AssetType',
  Currency = 'Currency',
  History = 'History',
  Ledger = 'Ledger',
}
