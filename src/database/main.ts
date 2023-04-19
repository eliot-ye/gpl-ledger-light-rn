import Realm from 'realm';
import {stringToUint8Array} from '@/utils/tools';
import {navigationRef} from '@/view/Router';
import {CPNAlert} from '@/components/base';
import {I18n} from '@/assets/I18n';

import {ColorSchema} from './color/schema';
import {getDefaultColors} from './color/default';
import {CurrencySchema} from './currency/schema';
import {getDefaultCurrency} from './currency/default';
import {AssetTypeSchema} from './assetType/schema';
import {getDefaultAssetTypes} from './assetType/default';
import {HistorySchema, LedgerSchema} from './ledger/schema';

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
        schema: [
          ColorSchema,
          CurrencySchema,
          AssetTypeSchema,
          LedgerSchema,
          HistorySchema,
        ],
        schemaVersion: 1,
        path: pathCache,
        encryptionKey: stringToUint8Array(encryptionKeyCache),
        onFirstOpen(_realm) {
          getDefaultColors().forEach(item => {
            _realm.create(ColorSchema.name, item);
          });

          getDefaultCurrency().forEach(item => {
            _realm.create(CurrencySchema.name, item);
          });

          getDefaultAssetTypes().forEach(item => {
            _realm.create(AssetTypeSchema.name, item);
          });
        },
      });
    } else {
      if (navigationRef.isReady()) {
        CPNAlert.open({
          message: I18n.SessionExpired,
          buttons: [
            {
              text: I18n.Confirm,
              onPress() {
                navigationRef.resetRoot({
                  routes: [{name: 'SignInPage'}],
                });
              },
            },
          ],
        });
      }
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
