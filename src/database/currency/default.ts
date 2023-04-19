import {getRandomStrMD5} from '@/utils/tools';
import {CurrencyItem} from './schema';

export function getDefaultCurrency(): CurrencyItem[] {
  return [
    {id: getRandomStrMD5(), name: '人民币', abbreviation: 'CNY', symbol: '￥'},
  ];
}
