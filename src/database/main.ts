import Realm from 'realm';
import {stringToUint8Array} from '@/utils/encoding';
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
import {LS_WebDAVAutoSync} from '@/store/localStorage';
import {SessionStorage} from '@/store/sessionStorage';
import {getBackupDataStr} from '@/view/settings/BackupPage';
import {WebDAVDirName, WebDAVFileNamePre} from '@/view/settings/WebDAVPage';

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

      realm.addListener('change', async sender => {
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
            `/${WebDAVDirName}/${WebDAVFileNamePre}${SessionStorage.username}.json`,
            backupDataStr,
            {ContentType: 'application/json'},
          );
          console.log('PUT', res);
        }
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
