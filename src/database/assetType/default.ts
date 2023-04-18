import {getRandomStrMD5} from '@/utils/tools';
import {AssetTypeItem} from './schema';

export function getDefaultAssetTypes(): AssetTypeItem[] {
  return [
    {id: getRandomStrMD5(), name: '现金', isAvailableAssets: true},
    {id: getRandomStrMD5(), name: '支付宝', isAvailableAssets: true},
    {id: getRandomStrMD5(), name: '微信', isAvailableAssets: true},

    {id: getRandomStrMD5(), name: '基金', isAvailableAssets: false},
    {id: getRandomStrMD5(), name: '定期', isAvailableAssets: false},
    {id: getRandomStrMD5(), name: '理财', isAvailableAssets: false},
  ];
}
