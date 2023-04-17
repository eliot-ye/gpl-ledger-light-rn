import {getRandomStrMD5} from '@/utils/tools';
import {AssetTypeItem} from './schema';

export function getDefaultAssetTypes(): AssetTypeItem[] {
  return [
    {id: getRandomStrMD5(), name: '现金', isAvailableAssets: true},
    {id: getRandomStrMD5(), name: '基金', isAvailableAssets: false},
  ];
}
