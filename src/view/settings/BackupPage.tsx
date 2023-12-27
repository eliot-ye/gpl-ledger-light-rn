import {
  CPNAlert,
  CPNCell,
  CPNCellGroup,
  CPNLoading,
  CPNPageView,
  CPNText,
  CPNToast,
} from '@/components/base';
import {I18n} from '@/assets/I18n';
import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, Share, Switch, View} from 'react-native';
import FS from 'react-native-fs';
import {
  dbGetAssetTypes,
  dbGetColors,
  dbGetCurrency,
  dbGetLedger,
  dbSetAssetTypeList,
  dbSetColorList,
  dbSetCurrencyList,
  dbSetLedgerList,
} from '@/database';
import {AESDecrypt, AESEncrypt} from '@/utils/encoding';
import {CusLog} from '@/utils/tools';
import {Colors} from '@/configs/colors';
import {PageProps} from '../Router';
import {LS_UserInfo, LS} from '@/store/localStorage';
import {envConstant} from '@/configs/env';
import {getWebDAVFileData} from './WebDAVPage';
import {formatDateTime} from '@/utils/dateFn';
import {Store} from '@/store';

interface BackupData {
  appId: string;
  versionName: string;
  versionCode: number;
  username?: string;
  backupTime: string;
  ledgerCiphertext: string;
}
interface LedgerData {
  username: string | undefined;
  assetType: any[];
  color: any[];
  currency: any[];
  ledger: any[];
}
export function getBackupDataStr(ledgerData: LedgerData) {
  const ledgerStr = JSON.stringify(ledgerData);
  const backupData: BackupData = {
    appId: envConstant.bundleId,
    versionName: envConstant.versionName,
    versionCode: envConstant.versionCode,
    username: Store.get('username'),
    backupTime: String(Date.now()),
    ledgerCiphertext: '',
  };
  const password = Store.get('password');
  if (password) {
    backupData.ledgerCiphertext = AESEncrypt(ledgerStr, password);
  }
  return JSON.stringify(backupData);
}

async function getLedgerData() {
  return {
    username: Store.get('username'),
    assetType: await dbGetAssetTypes(),
    color: await dbGetColors(),
    currency: await dbGetCurrency(),
    ledger: await dbGetLedger(),
  };
}

function getBackupPath(basePath: string) {
  const backupDirName = 'backup';
  const backupDirPath = `${basePath}/${backupDirName}`;
  const backupFileName = `gpl_ledger_${Store.get('username')}.json`;
  const backupFilePath = `${backupDirPath}/${backupFileName}`;

  return {
    dirName: backupDirName,
    dirPath: backupDirPath,
    filePath: backupFilePath,
  };
}

async function backupHandler(basePath: string, backupDataStr: string) {
  const backupItem = getBackupPath(basePath);
  const dirList = await FS.readDir(basePath);
  let hasBackupDir = false;
  for (let index = 0; index < dirList.length; index++) {
    const dirItem = dirList[index];
    if (dirItem.name === backupItem.dirName && dirItem.isDirectory()) {
      hasBackupDir = true;
    }
  }
  if (!hasBackupDir) {
    await FS.mkdir(backupItem.dirPath);
  }
  await FS.writeFile(backupItem.filePath, backupDataStr);

  return backupItem.filePath;
}

export async function recoveryFromWebDAV(showSuccess = true) {
  const WebDAVObject = Store.get('WebDAVObject');
  if (!WebDAVObject) {
    return;
  }

  const WebDAVFileData = getWebDAVFileData();
  const res = await WebDAVObject.GET(WebDAVFileData.path);

  if (res.status === 200 || res.status === 204) {
    const backupData = JSON.parse(decodeURIComponent(res.responseText));
    await recoveryFromJSON(backupData);
    if (showSuccess) {
      CPNToast.open(I18n.t('WebDAVRecoverySuccess'));
    }
  } else {
    CPNToast.open(I18n.t('WebDAVGetError', `[${WebDAVFileData.path}]`));
  }
}

async function recoveryFromJSON(backupData: BackupData, password?: string) {
  if (backupData.appId !== envConstant.bundleId) {
    CPNAlert.alert('', I18n.t('BackupFileError1'));
    return Promise.reject();
  }
  const username = Store.get('username');
  if (backupData.username !== username) {
    CPNAlert.alert('', I18n.t('BackupFileError2'));
    return Promise.reject();
  }

  let ledgerData: any;
  try {
    ledgerData = JSON.parse(
      AESDecrypt(
        backupData.ledgerCiphertext,
        password || Store.get('password') || '',
      ),
    );
  } catch (error) {
    CPNAlert.alert('', I18n.t('BackupFileError3'));
    return Promise.reject();
  }

  if (ledgerData.username !== username) {
    CPNAlert.alert('', I18n.t('BackupFileError2'));
    return Promise.reject();
  }

  const userId = Store.get('userId');
  if (userId) {
    const useInfo = await LS_UserInfo.getById(userId);
    if (
      useInfo &&
      useInfo.lastModified &&
      backupData.backupTime < useInfo.lastModified
    ) {
      await CPNAlert.confirm(
        I18n.t('BackupFileTips1'),
        I18n.f(
          I18n.t('BackupFileTips2'),
          formatDateTime(Number(backupData.backupTime)),
          formatDateTime(Number(useInfo.lastModified)),
        ),
      );
    }
  }

  await dbSetLedgerList(ledgerData.ledger);
  await dbSetAssetTypeList(ledgerData.assetType);
  await dbSetColorList(ledgerData.color);
  await dbSetCurrencyList(ledgerData.currency);
}

let backupDirBase = Platform.select({
  android: FS.DownloadDirectoryPath,
  ios: FS.DocumentDirectoryPath,
});
if (
  Platform.OS === 'android' &&
  Platform.Version > 29 &&
  Platform.Version < 33
) {
  backupDirBase = FS.DocumentDirectoryPath;
}

export function BackupPage({navigation}: PageProps<'BackupPage'>) {
  I18n.useLocal();
  const WebDAVObject = Store.useState('WebDAVObject');

  const [enableWebDAVSync, enableWebDAVSyncSet] = useState(false);
  useEffect(() => {
    LS.get('web_dav_auto_sync').then(enable => enableWebDAVSyncSet(enable));
  }, []);

  const hasWebDAV = !!WebDAVObject;

  return (
    <CPNPageView title={I18n.t('Backup')}>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.t('WebDAV')}
            value={WebDAVObject?.account}
            onPress={() => {
              navigation.navigate('WebDAVPage');
            }}
            isLast={!hasWebDAV}
          />
          {hasWebDAV && (
            <>
              <CPNCell
                title={I18n.t('WebDAVSync')}
                value={
                  <Switch
                    value={enableWebDAVSync}
                    onChange={async () => {
                      await LS.set('web_dav_auto_sync', !enableWebDAVSync);
                      enableWebDAVSyncSet(!enableWebDAVSync);
                    }}
                  />
                }
              />
              <CPNCell
                title={I18n.t('WebDAVRecovery')}
                value={getWebDAVFileData().name}
                onPress={async () => {
                  CPNLoading.open();
                  try {
                    await recoveryFromWebDAV();
                  } catch (error) {
                    CusLog.error('WebDAV', 'RecoveryFromWebDAV', error);
                  }
                  CPNLoading.close();
                }}
                isLast
              />
            </>
          )}
        </CPNCellGroup>

        <CPNCellGroup>
          <CPNCell
            title={I18n.t('BackupNow')}
            onPress={async () => {
              try {
                const backupDataStr = getBackupDataStr(await getLedgerData());

                if (Platform.OS === 'android') {
                  if (Platform.Version < 30) {
                    const status = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    );
                    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                      CPNToast.open(I18n.t('InsufficientPermissions'));
                      return;
                    }
                  }
                  const backupFilePath = await backupHandler(
                    backupDirBase || FS.DocumentDirectoryPath,
                    backupDataStr,
                  );
                  CPNToast.open(I18n.t('BackupSuccessTo', backupFilePath));
                }

                if (Platform.OS === 'ios') {
                  const backupFilePath = await backupHandler(
                    backupDirBase || FS.DocumentDirectoryPath,
                    backupDataStr,
                  );
                  const res = await Share.share({url: backupFilePath});
                  if (res.action === Share.dismissedAction) {
                    CPNToast.open(I18n.t('CanceledSave'));
                    return;
                  }
                  CPNToast.open(I18n.t('BackupSuccess'));
                }
              } catch (error) {
                CPNToast.open(I18n.t('BackupFailed'));
                CusLog.error('BackupNow', 'error', error);
              }
            }}
          />
          <CPNCell
            title={I18n.t('RecoveryNow')}
            onPress={async () => {
              try {
                const backupItem = getBackupPath(
                  backupDirBase || FS.DownloadDirectoryPath,
                );
                const res = await FS.readFile(backupItem.filePath);
                const backupData = JSON.parse(res);
                await recoveryFromJSON(backupData);
                CPNToast.open(I18n.t('RecoverySuccess'));
              } catch (error) {
                CPNToast.open(I18n.t('RecoveryFailed'));
                CusLog.error('RecoveryNow', 'error', error);
              }
            }}
            isLast
          />
        </CPNCellGroup>
        <View style={{padding: 10}}>
          <CPNText
            style={{
              fontSize: 12,
              color: Colors.fontSubtitle,
              marginBottom: 10,
            }}>
            {I18n.f(
              I18n.t('BackupPlaceholder'),
              getBackupPath(backupDirBase || FS.DocumentDirectoryPath).filePath,
            )}
          </CPNText>
          {Platform.OS === 'ios' && (
            <CPNText style={{fontSize: 12, color: Colors.fontSubtitle}}>
              {I18n.t('BackupPlaceholderIOS')}
            </CPNText>
          )}
        </View>
      </View>
    </CPNPageView>
  );
}
