import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNFormItem,
  CPNInput,
  CPNIonicons,
  CPNLoading,
  CPNPageView,
  CPNToast,
  HeaderConfigs,
  IONName,
} from '@/components/base';
import {WebDAVErrorResponseJson, createWebDAV} from '@/libs/WebDAV';
import {SessionStorage} from '@/store/sessionStorage';
import {LS_UserInfo} from '@/store/localStorage';
import {AESEncrypt} from '@/utils/encoding';
import {CusLog} from '@/utils/tools';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

const WebDAVDirName = 'gpl_ledger';
const WebDAVFileNamePre = 'backup_';
export function getWebDAVFileData() {
  const WebDAVFileName = `${WebDAVFileNamePre}${SessionStorage.get(
    'username',
  )}.json`;
  const WebDAVFilePath = `/${WebDAVDirName}/${WebDAVFileName}`;
  return {
    name: WebDAVFileName,
    path: WebDAVFilePath,
  };
}

export function WebDAVPage() {
  I18n.useLangCode();

  const StoreWebDAVObject = SessionStorage.useState('WebDAVObject');
  const [WebDAVDetails, WebDAVDetailsSet] = useState({
    serverPath: StoreWebDAVObject?.serverPath || '',
    account: StoreWebDAVObject?.account || '',
    password: StoreWebDAVObject?.password || '',
  });

  async function onSubmit() {
    const WebDAV = createWebDAV(WebDAVDetails);

    try {
      const PROPFINDRes = await WebDAV.PROPFIND(`/${WebDAVDirName}`);
      if (PROPFINDRes.status === 207) {
        CPNLoading.close();
        return WebDAV;
      } else if (PROPFINDRes.status === 404) {
        const PROPFINDError: WebDAVErrorResponseJson = PROPFINDRes.responseJson;
        if (
          PROPFINDError['d:error'] &&
          PROPFINDError['d:error']['s:exception'] === 'ObjectNotFound'
        ) {
          const MKCOLRes = await WebDAV.MKCOL(`/${WebDAVDirName}`);
          if (MKCOLRes.status === 201) {
            CPNLoading.close();
            return WebDAV;
          } else {
            const MKCOLError: WebDAVErrorResponseJson = MKCOLRes.responseJson;
            if (MKCOLError['d:error'] && MKCOLError['d:error']['s:message']) {
              return Promise.reject({
                status: MKCOLRes.status,
                message: MKCOLError['d:error']['s:message'],
              });
            }
            return Promise.reject({
              status: MKCOLRes.status,
              message: MKCOLRes.responseText,
            });
          }
        }
      } else {
        const errorJson: WebDAVErrorResponseJson = PROPFINDRes.responseJson;
        if (errorJson['d:error'] && errorJson['d:error']['s:message']) {
          return Promise.reject({
            status: PROPFINDRes.status,
            message: errorJson['d:error']['s:message'],
          });
        }
        return Promise.reject({
          status: PROPFINDRes.status,
          message: PROPFINDRes.responseText,
        });
      }
    } catch (error: any) {
      const errorJson: WebDAVErrorResponseJson = error.responseJson;
      if (errorJson['d:error'] && errorJson['d:error']['s:message']) {
        return Promise.reject(errorJson['d:error']['s:message']);
      }
      return Promise.reject({
        status: error.status,
        message: error.responseText,
      });
    }
  }

  return (
    <CPNPageView
      title={I18n.t('WebDAV')}
      rightIcon={
        !!SessionStorage.get('WebDAVObject') && (
          <TouchableOpacity
            style={{paddingRight: HeaderConfigs.paddingHorizontal}}
            onPress={async () => {
              await CPNAlert.confirm(
                '',
                I18n.f(I18n.t('DeleteConfirm'), ` ${I18n.t('WebDAV')}`),
              );
              await LS_UserInfo.update({
                id: SessionStorage.get('userId'),
                web_dav: '',
              });
              SessionStorage.update('WebDAVObject', null);
              WebDAVDetailsSet({
                serverPath: '',
                account: '',
                password: '',
              });
            }}>
            <CPNIonicons name={IONName.Delete} />
          </TouchableOpacity>
        )
      }>
      <View style={{padding: 20}}>
        <CPNFormItem
          style={{paddingBottom: 10}}
          title={I18n.t('WebDAVServerPath')}>
          <CPNInput
            value={WebDAVDetails.serverPath}
            onChangeText={serverPath => {
              WebDAVDetailsSet({...WebDAVDetails, serverPath});
            }}
          />
        </CPNFormItem>
        <CPNFormItem
          style={{paddingBottom: 10}}
          title={I18n.t('WebDAVAccount')}>
          <CPNInput
            value={WebDAVDetails.account}
            onChangeText={account => {
              WebDAVDetailsSet({...WebDAVDetails, account});
            }}
          />
        </CPNFormItem>
        <CPNFormItem
          style={{paddingBottom: 50}}
          title={I18n.t('WebDAVPassword')}>
          <CPNInput
            value={WebDAVDetails.password}
            onChangeText={password => {
              WebDAVDetailsSet({...WebDAVDetails, password});
            }}
            secureTextEntry
          />
        </CPNFormItem>

        <CPNButton
          children={I18n.t('WebDAVSubmit')}
          onPress={async () => {
            CPNLoading.open();
            try {
              const WebDAVObject = await onSubmit();
              SessionStorage.update('WebDAVObject', WebDAVObject || null);

              const password = SessionStorage.get('password');
              if (password) {
                await LS_UserInfo.update({
                  id: SessionStorage.get('userId'),
                  web_dav: AESEncrypt(JSON.stringify(WebDAVDetails), password),
                });
              }

              CPNToast.open(I18n.t('WebDAVSuccess'));
            } catch (error: any) {
              CusLog.error('WebDAVSubmit', 'onSubmit', error);
              if (error.message) {
                CPNToast.open(error.message);
              } else if (error.status === 401) {
                CPNAlert.alert('', I18n.t('WebDAVUnauthorized'));
              } else {
                CPNToast.open(I18n.t('WebDAVFailed'));
              }
            }
            CPNLoading.close();
          }}
        />
      </View>
    </CPNPageView>
  );
}
