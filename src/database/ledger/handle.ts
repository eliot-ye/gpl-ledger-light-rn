import {UpdateMode} from 'realm';
import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {LedgerItem} from './schema';
import {useEffect, useState} from 'react';

export async function dbGetLedger(): Promise<Readonly<LedgerItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);

  return res.toJSON() as any;
}
export function useDBGetLedger() {
  const [data, dataSet] = useState<Readonly<LedgerItem>[]>([]);
  useEffect(() => {
    const listener = () => {
      dbGetLedger().then(dataSet);
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
  }, []);
  return data;
}

export async function dbSetLedger(item: Partial<LedgerItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Ledger, item, UpdateMode.Modified);
  });
}
export async function dbSetLedgerList(list: Partial<LedgerItem>[]) {
  const realm = await getRealm();

  realm.write(() => {
    list.forEach(item => {
      realm.create(SchemaName.Ledger, item, UpdateMode.Modified);
    });
  });
}

export async function dbDeleteLedger(id: string) {
  const realm = await getRealm();

  const data = realm.objectForPrimaryKey<LedgerItem>(SchemaName.Ledger, id);

  if (!data) {
    return Promise.reject(`Ledger id (${id}) 不存在`);
  }

  realm.write(() => {
    realm.delete(data);
  });
}
