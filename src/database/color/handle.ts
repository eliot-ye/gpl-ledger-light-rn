import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {ColorItem} from './schema';

export async function dbGetColors(): Promise<Readonly<ColorItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<ColorItem>(SchemaName.Color);

  return res.toJSON() as any;
}

export async function dbSetColor(item: Partial<ColorItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Color, item, Realm.UpdateMode.Modified);
  });
}

export async function dbDeleteColor(id: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<ColorItem>(SchemaName.Color, id);

  if (!data) {
    return Promise.reject(`id (${id}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
