import {LedgerItem} from '../ledger/schema';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {CurrencyItem} from './schema';

export async function dbGetCurrencyUsedIds() {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);
  const ids = res.map(item => item.currency.id);

  return ids;
}

export async function dbGetCurrency(
  isUsed?: boolean,
): Promise<Readonly<CurrencyItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<CurrencyItem>(SchemaName.Currency);

  if (isUsed === undefined) {
    return res.toJSON() as any;
  }

  const usedIds = await dbGetCurrencyUsedIds();
  if (isUsed === true) {
    return res.filter(item => usedIds.includes(item.id));
  } else {
    return res.filter(item => !usedIds.includes(item.id));
  }
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
