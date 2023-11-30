import {AssetTypeItem} from './schema';

export function getDefaultAssetTypes(): AssetTypeItem[] {
  return [
    {name: '现金', symbol: 'Cash', isAvailableAssets: true},
    {name: '支付宝', symbol: 'Alipay', isAvailableAssets: true},
    {name: '微信', symbol: 'WeChat', isAvailableAssets: true},
    {name: '活期储蓄', symbol: 'CurrentSavings', isAvailableAssets: true},

    {name: '定期储蓄', symbol: 'FixedDeposit', isAvailableAssets: false},
    {name: '股票', symbol: 'Stock', isAvailableAssets: false},
    {name: '基金', symbol: 'Funds', isAvailableAssets: false},
    {name: '债券', symbol: 'Bond', isAvailableAssets: false},
    {name: '保险', symbol: 'Insurance', isAvailableAssets: false},
    {name: '期货', symbol: 'Futures', isAvailableAssets: false},
    {name: '黄金', symbol: 'Gold', isAvailableAssets: false},
    {name: '白银', symbol: 'Silver', isAvailableAssets: false},
    {name: '外借', symbol: 'Loan', isAvailableAssets: false},
  ];
}
