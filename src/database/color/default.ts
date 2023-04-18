import {getRandomStrMD5} from '@/utils/tools';
import {ColorItem} from './schema';

export function getDefaultColors(): ColorItem[] {
  return [
    {id: getRandomStrMD5(), name: '青丹', value: '#80752c'},
    {id: getRandomStrMD5(), name: '媚茶', value: '#454926'},
    {id: getRandomStrMD5(), name: '青钝', value: '#4d4f36'},
    {id: getRandomStrMD5(), name: '抹茶色', value: '#b7ba6b'},
    {id: getRandomStrMD5(), name: '黄緑', value: '#b2d235'},
    {id: getRandomStrMD5(), name: '赤丹', value: '#d64f44'},
    {id: getRandomStrMD5(), name: '红赤', value: '#d93a49'},
    {id: getRandomStrMD5(), name: '臙脂色', value: '#b3424a'},
    {id: getRandomStrMD5(), name: '草色', value: '#6d8346'},
    {id: getRandomStrMD5(), name: '青蓝', value: '#102b6a'},
    {id: getRandomStrMD5(), name: '青褐', value: '#121a2a'},
  ];
}
