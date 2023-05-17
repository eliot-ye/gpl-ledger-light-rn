import {SchemaName, createObjectSchema} from '../schemaType';

export interface CurrencyItem {
  name: string;
  abbreviation: string;
  symbol: string;
}

export const CurrencySchema = createObjectSchema<CurrencyItem>({
  name: SchemaName.Currency,
  primaryKey: 'abbreviation',
  properties: {
    name: 'string',
    abbreviation: 'string',
    symbol: 'string',
  },
});
