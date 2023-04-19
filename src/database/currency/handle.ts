import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {CurrencyItem} from './schema';

export async function dbGetCurrency(): Promise<Readonly<CurrencyItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<CurrencyItem>(SchemaName.Currency);

  return res.toJSON() as any;
}

export async function dbSetCurrency(item: Partial<CurrencyItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Currency, item, Realm.UpdateMode.Modified);
  });
}

export async function dbDeleteCurrency(id: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<CurrencyItem>(SchemaName.Currency, id);

  if (!data) {
    return Promise.reject(`Currency id (${id}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
