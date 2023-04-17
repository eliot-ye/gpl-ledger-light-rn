import type {ObjectSchema, ObjectSchemaProperty, PropertyType} from 'realm';

interface Schema<T> extends ObjectSchema {
  properties: {
    [K in keyof T]: ObjectSchemaProperty | PropertyType;
  };
}

export function createObjectSchema<T>(schema: Schema<T>) {
  return schema;
}

export enum SchemaName {
  Color = 'Color',
  AssetType = 'AssetType',
}
