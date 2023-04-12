import {SchemaName, createObjectSchema} from '../schemaType';

export interface ColorItem {
  id: string;
  name: string;
  value: string;
}

export const ColorSchema = createObjectSchema<ColorItem>({
  name: SchemaName.Color,
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    value: 'string',
  },
});
