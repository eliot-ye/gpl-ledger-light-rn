import {SchemaName, SchemaProperties} from './schemaName';

export interface ColorItem {
  id: string;
  name: string;
  value: string;
}

const properties: SchemaProperties<ColorItem> = {
  id: 'string',
  name: 'string',
  value: 'string',
};

export const ColorSchema = {
  name: SchemaName.Color,
  primaryKey: 'id',
  properties,
};
