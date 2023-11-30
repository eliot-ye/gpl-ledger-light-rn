import {ColorItem} from './schema';

export function getDefaultColors(): ColorItem[] {
  return [
    {name: '青丹', value: '#80752c'},
    {name: '媚茶', value: '#454926'},
    {name: '抹茶色', value: '#b7ba6b'},
    {name: '淡黄', value: '#f9d423'},
    {name: '淡紫', value: '#9966cc'},
    {name: '淡粉', value: '#ff99cc'},

    {name: '支付宝蓝', value: '#1678ff'},
    {name: '微信绿', value: '#1AAD19'},
    {name: '中国银行红', value: '#a71e32'},
    {name: '工商银行红', value: '#c7000b'},
    {name: '建设银行蓝', value: '#0066b3'},
    {name: '农业银行绿', value: '#319C8B'},
  ];
}
