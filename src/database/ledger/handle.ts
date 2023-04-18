import {getRealm} from '../main';
import {SchemaName} from '../schemaType';
import {LedgerItem} from './schema';

export async function dbGetLedger(): Promise<Readonly<LedgerItem>[]> {
  const realm = await getRealm();

  const res = realm.objects<LedgerItem>(SchemaName.Ledger);

  return res.toJSON() as any;
}

export async function dbSetLedger(item: Partial<LedgerItem>) {
  const realm = await getRealm();

  realm.write(() => {
    realm.create(SchemaName.Ledger, item, Realm.UpdateMode.Modified);
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
