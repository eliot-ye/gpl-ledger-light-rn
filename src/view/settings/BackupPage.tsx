import {
  CPNCell,
  CPNCellGroup,
  CPNPageView,
  CPNText,
  CPNToast,
} from '@/components/base';
import {I18n} from '@/assets/I18n';
import {SessionStorage} from '@/store/sessionStorage';
import React from 'react';
import {PermissionsAndroid, Platform, Share, View} from 'react-native';
import FS from 'react-native-fs';
import {
  dbGetAssetTypes,
  dbGetColors,
  dbGetCurrency,
  dbGetLedger,
} from '@/database';
import {AESEncrypt} from '@/utils/encoding';
import {CusLog} from '@/utils/tools';
import {Colors} from '@/configs/colors';

async function getBackupDataStr() {
  const ledgerData = {
    username: SessionStorage.username,
    assetType: await dbGetAssetTypes(),
    color: await dbGetColors(),
    currency: await dbGetCurrency(),
    ledger: await dbGetLedger(),
  };
  const ledgerStr = JSON.stringify(ledgerData);
  const backupData = {
    usename: SessionStorage.username,
    ledgerCiphertext: '',
  };
  if (SessionStorage.password) {
    backupData.ledgerCiphertext = AESEncrypt(
      ledgerStr,
      SessionStorage.password,
    );
  }
  return JSON.stringify(backupData);
}

function getBackupPath(basePath: string) {
  const backupDirName = 'backup';
  const backupDirPath = `${basePath}/${backupDirName}`;
  const backupFilePath = `${backupDirPath}/gpl_ledger_${SessionStorage.username}.json`;

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

const backupDirBase = Platform.select({
  android: FS.ExternalDirectoryPath,
  ios: FS.DocumentDirectoryPath,
});

export function BackupPage() {
  return (
    <CPNPageView title={I18n.Backup}>
      <View style={{padding: 20}}>
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell title={'webdav'} />
        </CPNCellGroup>

        <CPNCellGroup>
          <CPNCell
            title={I18n.BackupNow}
            onPress={async () => {
              try {
                const backupDataStr = await getBackupDataStr();

                if (Platform.OS === 'android') {
                  const permission = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                  );
                  if (!permission) {
                    const status = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    );
                    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
                      CPNToast.open({text: I18n.InsufficientPermissions});
                      return;
                    }
                  }
                  const backupFilePath = await backupHandler(
                    backupDirBase || FS.ExternalDirectoryPath,
                    backupDataStr,
                  );
                  CPNToast.open({
                    text: I18n.formatString(
                      I18n.BackupSuccessTo,
                      backupFilePath,
                    ) as string,
                  });
                }

                if (Platform.OS === 'ios') {
                  const backupFilePath = await backupHandler(
                    backupDirBase || FS.DocumentDirectoryPath,
                    backupDataStr,
                  );
                  const action = await Share.share({url: backupFilePath});
                  if (action.action === Share.dismissedAction) {
                    CPNToast.open({text: I18n.CanceledSave});
                    return;
                  }
                  CPNToast.open({text: I18n.BackupSuccess});
                }
              } catch (error) {
                CPNToast.open({text: I18n.BackupFailed});
                CusLog.error('backup', 'error', error);
              }
            }}
            isLast
          />
        </CPNCellGroup>
        <View style={{padding: 10}}>
          <CPNText style={{fontSize: 12, color: Colors.fontSubtitle}}>
            {Platform.OS === 'ios'
              ? I18n.BackupPlaceholderIOS
              : I18n.formatString(
                  I18n.BackupPlaceholder,
                  getBackupPath(backupDirBase || FS.ExternalDirectoryPath)
                    .filePath,
                )}
          </CPNText>
        </View>
      </View>
    </CPNPageView>
  );
}
