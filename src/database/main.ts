import Realm from 'realm';
import {stringToUint8Array} from '@/utils/tools';

import {ColorSchema} from './color/schema';
import {getDefaultColors} from './color/default';

import {AssetTypeSchema} from './assetType/schema';
import {getDefaultAssetTypes} from './assetType/default';

let realm: Realm | undefined;

let pathCache = '';
let encryptionKeyCache = '';

export async function getRealm(path?: string, encryptionKey?: string) {
  if (!realm || realm.isClosed) {
    if (path && encryptionKey) {
      pathCache = path;
      encryptionKeyCache = encryptionKey;
    }

    if (pathCache && encryptionKeyCache) {
      realm = await Realm.open({
        schema: [ColorSchema, AssetTypeSchema],
        schemaVersion: 1,
        path: pathCache,
        encryptionKey: stringToUint8Array(encryptionKeyCache),
        onFirstOpen(_realm) {
          getDefaultColors().forEach(item => {
            _realm.create(ColorSchema.name, item);
          });

          getDefaultAssetTypes().forEach(item => {
            _realm.create(AssetTypeSchema.name, item);
          });
        },
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
