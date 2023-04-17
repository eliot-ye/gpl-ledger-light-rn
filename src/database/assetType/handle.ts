import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {AssetTypeItem} from './schema';

export async function dbGetAssetTypes(): Promise<Readonly<AssetTypeItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<AssetTypeItem>(SchemaName.AssetType);

  return res.toJSON() as any;
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
