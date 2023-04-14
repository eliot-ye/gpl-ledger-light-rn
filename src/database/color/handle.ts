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
