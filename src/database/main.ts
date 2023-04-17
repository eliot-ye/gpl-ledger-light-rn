import Realm from 'realm';
import {stringToUint8Array} from '@/utils/tools';

import {ColorSchema} from './color/schema';
import {getDefaultColors} from './color/default';

import {AssetTypeSchema} from './assetType/schema';
import {getDefaultAssetTypes} from './assetType/default';

let realm: Realm | undefined;

export async function getRealm(path?: string, encryptionKey?: string) {
  if (!realm || realm.isClosed) {
    if (path && encryptionKey) {
      realm = await Realm.open({
        schema: [ColorSchema, AssetTypeSchema],
        schemaVersion: 1,
        path,
        encryptionKey: stringToUint8Array(encryptionKey),
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
