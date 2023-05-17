import {LedgerItem} from '../ledger/schema';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {ColorItem} from './schema';

export async function dbGetColorsUsedIds() {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);
  const ids = res.map(item => item.color.value);

  return ids;
}

export async function dbGetColors(
  isUsed?: boolean,
): Promise<Readonly<ColorItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<ColorItem>(SchemaName.Color);

  if (isUsed === undefined) {
    return res.toJSON() as any;
  }

  const usedIds = await dbGetColorsUsedIds();
  if (isUsed === true) {
    return res.filter(item => usedIds.includes(item.value));
  } else {
    return res.filter(item => !usedIds.includes(item.value));
  }
}

export async function dbSetColor(item: Partial<ColorItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Color, item, Realm.UpdateMode.Modified);
  });
}
export async function dbSetColorList(list: Partial<ColorItem>[]) {
  const realm = await getRealm();

  realm.write(() => {
    list.forEach(item => {
      realm.create(SchemaName.Color, item, Realm.UpdateMode.Modified);
    });
  });
}

export async function dbDeleteColor(value: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<ColorItem>(SchemaName.Color, value);

  if (!data) {
    return Promise.reject(`Color value (${value}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
