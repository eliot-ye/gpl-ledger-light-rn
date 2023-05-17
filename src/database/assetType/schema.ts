import {SchemaName, createObjectSchema} from '../schemaType';

export interface AssetTypeItem {
  name: string;
  symbol: string;
  isAvailableAssets: boolean;
}

export const AssetTypeSchema = createObjectSchema<AssetTypeItem>({
  name: SchemaName.AssetType,
  primaryKey: 'symbol',
  properties: {
    name: 'string',
    symbol: 'string',
    isAvailableAssets: 'bool',
  },
});
