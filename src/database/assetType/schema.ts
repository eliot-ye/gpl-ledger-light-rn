import {SchemaName, createObjectSchema} from '../schemaType';

export interface AssetTypeItem {
  id: string;
  name: string;
  isAvailableAssets: boolean;
}

export const AssetTypeSchema = createObjectSchema<AssetTypeItem>({
  name: SchemaName.AssetType,
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    isAvailableAssets: 'bool',
  },
});
