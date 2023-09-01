import {UpdateMode} from 'realm';
import {LedgerItem} from '../ledger/schema';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {AssetTypeItem} from './schema';

export async function dbGetAssetTypesUsedIds() {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);
  const ids = res.map(item => item.assetType.symbol);

  return ids;
}
export async function dbGetAssetTypes(
  isUsed?: boolean,
): Promise<Readonly<AssetTypeItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<AssetTypeItem>(SchemaName.AssetType);

  if (isUsed === undefined) {
    return res.toJSON() as any;
  }

  const usedIds = await dbGetAssetTypesUsedIds();
  if (isUsed === true) {
    return res.filter(item => usedIds.includes(item.symbol));
  } else {
    return res.filter(item => !usedIds.includes(item.symbol));
  }
}

export async function dbSetAssetType(item: Partial<AssetTypeItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.AssetType, item, UpdateMode.Modified);
  });
}
export async function dbSetAssetTypeList(list: Partial<AssetTypeItem>[]) {
  const realm = await getRealm();

  realm.write(() => {
    list.forEach(item => {
      realm.create(SchemaName.AssetType, item, UpdateMode.Modified);
    });
  });
}

export async function dbDeleteAssetType(symbol: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<AssetTypeItem>(
    SchemaName.AssetType,
    symbol,
  );

  if (!data) {
    return Promise.reject(`AssetType symbol (${symbol}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
