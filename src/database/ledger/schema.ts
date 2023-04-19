import {AssetTypeItem} from '../assetType/schema';
import {ColorItem} from '../color/schema';
import {CurrencyItem} from '../currency/schema';
import {SchemaName, createObjectSchema} from '../schemaType';

export interface HistoryItem {
  /** 修改（添加）日期时间戳 */
  date: number;
  amountMoney: number;
}

export const HistorySchema = createObjectSchema<HistoryItem>({
  name: SchemaName.History,
  embedded: true,
  properties: {
    date: 'int',
    amountMoney: 'float',
  },
});

export interface LedgerItem {
  id: string;
  name: string;
  amountMoney: number;
  color: ColorItem;
  currency: CurrencyItem;
  assetType: AssetTypeItem;
  history: HistoryItem[];
}

export const LedgerSchema = createObjectSchema<LedgerItem>({
  name: SchemaName.Ledger,
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    amountMoney: 'float',
    color: SchemaName.Color,
    currency: SchemaName.Currency,
    assetType: SchemaName.AssetType,
    history: {type: 'list', objectType: SchemaName.History},
  },
});
