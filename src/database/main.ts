import Realm, {UpdateMode} from 'realm';
import {stringToUint8Array} from '@/utils/encoding';
import {navigationRef} from '@/view/Router';
import {CPNAlert, CPNToast} from '@/components/base';
import {I18n} from '@/assets/I18n';

import {ColorSchema} from './color/schema';
import {getDefaultColors} from './color/default';
import {CurrencySchema} from './currency/schema';
import {getDefaultCurrency} from './currency/default';
import {AssetTypeSchema} from './assetType/schema';
import {getDefaultAssetTypes} from './assetType/default';
import {HistorySchema, LedgerSchema} from './ledger/schema';
import {LS_WebDAVAutoSync} from '@/store/localStorage';
import {SessionStorage} from '@/store/sessionStorage';
import {getBackupDataStr} from '@/view/settings/BackupPage';
import {getWebDAVFileData} from '@/view/settings/WebDAVPage';
import {debounce} from '@/utils/tools';

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
        path: pathCache + '.realm',
        encryptionKey: stringToUint8Array(encryptionKeyCache),
        onFirstOpen(_realm) {
          getDefaultColors().forEach(item => {
            _realm.create(ColorSchema.name, item, UpdateMode.Never);
          });

          getDefaultCurrency().forEach(item => {
            _realm.create(CurrencySchema.name, item, UpdateMode.Never);
          });

          getDefaultAssetTypes().forEach(item => {
            _realm.create(AssetTypeSchema.name, item, UpdateMode.Never);
          });
        },
      });

      realm.addListener(
        'change',
        debounce(async sender => {
          const enabled = await LS_WebDAVAutoSync.get();
          if (enabled && SessionStorage.WebDAVObject) {
            const backupDataStr = getBackupDataStr({
              username: SessionStorage.username,
              assetType: sender.objects(AssetTypeSchema.name).toJSON(),
              color: sender.objects(ColorSchema.name).toJSON(),
              currency: sender.objects(CurrencySchema.name).toJSON(),
              ledger: sender.objects(LedgerSchema.name).toJSON(),
            });
            const res = await SessionStorage.WebDAVObject.PUT(
              getWebDAVFileData().path,
              backupDataStr,
              {ContentType: 'application/json'},
            );
            if (res.status !== 201 && res.status !== 204) {
              CPNToast.open({text: res.responseText || res.status});
            }
          }
        }),
      );
    } else {
      if (navigationRef.isReady()) {
        CPNAlert.open({
          message: I18n.t('SessionExpired'),
          buttons: [
            {
              text: I18n.t('Confirm'),
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
  // console.log('Realm encryptionKeyCache: ' + encryptionKeyCache);
  // console.log('Realm file is located at: ' + realm.path);
  return realm;
}

export function closeRealm() {
  if (realm && !realm.isClosed) {
    realm.close();
  }
  realm = undefined;
}
