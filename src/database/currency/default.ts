import {CurrencyItem} from './schema';

export function getDefaultCurrency(): CurrencyItem[] {
  return [{name: '人民币', abbreviation: 'CNY', symbol: '￥'}];
}
