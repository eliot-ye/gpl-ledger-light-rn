import {UpdateMode} from 'realm';
import {LedgerItem} from '../ledger/schema';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {CurrencyItem} from './schema';
import {useEffect, useState} from 'react';

export async function dbGetCurrencyUsedIds() {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);
  const ids = res.map(item => item.currency.symbol);

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
    return res.filter(item => usedIds.includes(item.symbol));
  } else {
    return res.filter(item => !usedIds.includes(item.symbol));
  }
}
export function useDBGetCurrency(isUsed?: boolean) {
  const [data, dataSet] = useState<Readonly<CurrencyItem>[]>([]);
  useEffect(() => {
    const listener = () => {
      dbGetCurrency(isUsed).then(dataSet);
    };
    listener();
    getRealm().then(realm => {
      realm.addListener('change', listener);
    });
    return () => {
      getRealm().then(realm => {
        realm.removeListener('change', listener);
      });
    };
  }, [isUsed]);
  return data;
}

export async function dbSetCurrency(item: Partial<CurrencyItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Currency, item, UpdateMode.Modified);
  });
}
export async function dbSetCurrencyList(list: Partial<CurrencyItem>[]) {
  const realm = await getRealm();

  realm.write(() => {
    list.forEach(item => {
      realm.create(SchemaName.Currency, item, UpdateMode.Modified);
    });
  });
}

export async function dbDeleteCurrency(symbol: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<CurrencyItem>(
    SchemaName.Currency,
    symbol,
  );

  if (!data) {
    return Promise.reject(`Currency symbol (${symbol}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
