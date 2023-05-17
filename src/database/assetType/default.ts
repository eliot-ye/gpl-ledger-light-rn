import {AssetTypeItem} from './schema';

export function getDefaultAssetTypes(): AssetTypeItem[] {
  return [
    {symbol: 'Cash', name: '现金', isAvailableAssets: true},
    {symbol: 'Alipay', name: '支付宝', isAvailableAssets: true},
    {symbol: 'WeChat', name: '微信', isAvailableAssets: true},

    {symbol: 'Funds', name: '基金', isAvailableAssets: false},
    {symbol: 'FixedDeposit', name: '定期', isAvailableAssets: false},
    {symbol: 'FinancialManagement', name: '理财', isAvailableAssets: false},
  ];
}
