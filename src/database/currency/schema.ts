import {SchemaName, createObjectSchema} from '../schemaType';

export interface CurrencyItem {
  id: string;
  name: string;
  abbreviation: string;
  symbol: string;
}

export const CurrencySchema = createObjectSchema<CurrencyItem>({
  name: SchemaName.Currency,
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    abbreviation: 'string',
    symbol: 'string',
  },
});
