import {getRandomStrMD5} from '@/utils/tools';
import {ColorItem} from './schema';
import {Colors} from '@/configs/colors';

export function getDefaultColors(): ColorItem[] {
  return [
    {id: getRandomStrMD5(), name: 'success', value: Colors.success},
    {id: getRandomStrMD5(), name: 'warning', value: Colors.warning},
  ];
}
