import {LedgerItem} from '../ledger/schema';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {AssetTypeItem} from './schema';

export async function dbGetAssetTypesUsedIds() {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);
  const ids = res.map(item => item.assetType.id);

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
    return res.filter(item => usedIds.includes(item.id));
  } else {
    return res.filter(item => !usedIds.includes(item.id));
  }
}

export async function dbSetAssetType(item: Partial<AssetTypeItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.AssetType, item, Realm.UpdateMode.Modified);
  });
}

export async function dbDeleteAssetType(id: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<AssetTypeItem>(
    SchemaName.AssetType,
    id,
  );

  if (!data) {
    return Promise.reject(`AssetType id (${id}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
