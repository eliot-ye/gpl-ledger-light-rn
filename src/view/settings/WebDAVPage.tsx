import {I18n} from '@/assets/I18n';
import {
  CPNAlert,
  CPNButton,
  CPNFormItem,
  CPNInput,
  CPNLoading,
  CPNPageView,
  CPNToast,
} from '@/components/base';
import {WebDAVErrorResponseJson, createWebDAV} from '@/libs/CreateWebDAV';
import {LS_UserInfo} from '@/store/localStorage';
import {SessionStorage} from '@/store/sessionStorage';
import {AESEncrypt} from '@/utils/encoding';
import React, {useState} from 'react';
import {View} from 'react-native';

export const WebDAVDirName = 'gpl_ledger';
export const WebDAVFileNamePre = 'backup_';

export function WebDAVPage() {
  const [WebDAVDetails, WebDAVDetailsSet] = useState({
    serverPath: SessionStorage.WebDAVObject?.serverPath || '',
    account: SessionStorage.WebDAVObject?.account || '',
    password: SessionStorage.WebDAVObject?.password || '',
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
              return Promise.reject(MKCOLError['d:error']['s:message']);
            }
          }
        }
      } else {
        const errorJson: WebDAVErrorResponseJson = PROPFINDRes.responseJson;
        if (errorJson['d:error'] && errorJson['d:error']['s:message']) {
          return Promise.reject(errorJson['d:error']['s:message']);
        }
      }
    } catch (error: any) {
      const errorJson: WebDAVErrorResponseJson = error.responseJson;
      if (errorJson['d:error'] && errorJson['d:error']['s:message']) {
        return Promise.reject(errorJson['d:error']['s:message']);
      }
    }
  }

  return (
    <CPNPageView title={I18n.WebDAV}>
      <View style={{padding: 20}}>
        <CPNFormItem style={{paddingBottom: 10}} title={I18n.WebDAVServerPath}>
          <CPNInput
            value={WebDAVDetails.serverPath}
            onChangeText={serverPath => {
              WebDAVDetailsSet({...WebDAVDetails, serverPath});
            }}
          />
        </CPNFormItem>
        <CPNFormItem style={{paddingBottom: 10}} title={I18n.WebDAVAccount}>
          <CPNInput
            value={WebDAVDetails.account}
            onChangeText={account => {
              WebDAVDetailsSet({...WebDAVDetails, account});
            }}
          />
        </CPNFormItem>
        <CPNFormItem style={{paddingBottom: 50}} title={I18n.WebDAVPassword}>
          <CPNInput
            value={WebDAVDetails.password}
            onChangeText={password => {
              WebDAVDetailsSet({...WebDAVDetails, password});
            }}
            secureTextEntry
          />
        </CPNFormItem>

        <CPNButton
          children={I18n.WebDAVSubmit}
          onPress={async () => {
            CPNLoading.open();
            try {
              const WebDAVObject = await onSubmit();
              SessionStorage.setValue('WebDAVObject', WebDAVObject);

              if (SessionStorage.password) {
                await LS_UserInfo.update({
                  id: SessionStorage.userId,
                  web_dav: AESEncrypt(
                    JSON.stringify(WebDAVDetails),
                    SessionStorage.password,
                  ),
                });
              }

              CPNToast.open({text: I18n.WebDAVSuccess});
            } catch (error: any) {
              CPNAlert.open({message: error});
            }
            CPNLoading.close();
          }}
        />
      </View>
    </CPNPageView>
  );
}
