import Realm from 'realm';
import {ColorSchema} from './color/schema';
import {stringToUint8Array} from '@/utils/tools';

let realm: Realm | undefined;

export async function getRealm(path?: string, encryptionKey?: string) {
  if (!realm || realm.isClosed) {
    if (path && encryptionKey) {
      realm = await Realm.open({
        schema: [ColorSchema],
        schemaVersion: 1,
        path,
        encryptionKey: stringToUint8Array(encryptionKey),
      });
    } else {
      return Promise.reject('realm is closed');
    }
  }
  return realm;
}

export function closeRealm() {
  if (realm && !realm.isClosed) {
    realm.close();
    realm = undefined;
  }
}
