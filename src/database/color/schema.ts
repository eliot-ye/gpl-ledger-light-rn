import {SchemaName, createObjectSchema} from '../schemaType';

export interface ColorItem {
  name: string;
  value: string;
}

export const ColorSchema = createObjectSchema<ColorItem>({
  name: SchemaName.Color,
  primaryKey: 'value',
  properties: {
    name: 'string',
    value: 'string',
  },
});
