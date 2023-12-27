import {
  CPNButton,
  CPNDropdown,
  CPNPageView,
  CPNText,
  DataConstraint,
  CPNFormItem,
  CPNInput,
  CPNIonicons,
  IONName,
  CPNAlert,
  CPNImage,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import {LSUserInfo, LS, useLSUserInfoList} from '@/store/localStorage';
import {AESDecrypt} from '@/utils/encoding';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {PageProps} from '../Router';
import {Store} from '@/store';
import {getRealm} from '@/database/main';
import {I18n} from '@/assets/I18n';
import {biometrics} from '@/utils/biometrics';
import {CPNDivisionLine} from '@/components/CPNDivisionLine';
import {createWebDAV} from '@/libs/WebDAV';
import {CusLog} from '@/utils/tools';

import {recoveryFromWebDAV} from '../settings/BackupPage';

export function SignInPage() {
  const navigation = useNavigation<PageProps<'SignInPage'>['navigation']>();

  I18n.useLocal();

  const useInfoList = useLSUserInfoList();
  const useInfoListMemo = useMemo(
    () =>
      useInfoList.map(item => ({
        ...item,
        label: item.username,
        value: item.id,
      })),
    [useInfoList],
  );

  const [userInfo, userInfoSet] = useState<
    Partial<LSUserInfo> & DataConstraint
  >({value: ''});
  function renderUserInfoInput() {
    return (
      <CPNFormItem style={{paddingBottom: 20}} title={I18n.t('Username')}>
        <CPNDropdown
          placeholder={
            useInfoListMemo.length > 0
              ? I18n.t('SelectUser')
              : I18n.t('PleaseRegisterUser')
          }
          data={useInfoListMemo}
          checked={userInfo.value}
          onChange={data => {
            userInfoSet({...data});
          }}
        />
      </CPNFormItem>
    );
  }

  const getUserInfo = useCallback(async () => {
    const lastId = await LS.get('last_user_id');
    const info = useInfoList.find(item => item.id === lastId);
    if (info) {
      userInfoSet({...info, label: info.username, value: info.id});
    } else if (useInfoList[0]) {
      userInfoSet({
        ...useInfoList[0],
        label: useInfoList[0].username,
        value: useInfoList[0].id,
      });
    } else {
      userInfoSet({value: ''});
    }
  }, [useInfoList]);
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const [password, passwordSet] = useState({value: '', hasError: false});
  const [secureTextEntry, secureTextEntrySet] = useState(true);
  function renderPasswordInput() {
    return (
      <CPNFormItem
        style={{paddingBottom: 30}}
        title={I18n.t('Password')}
        errorText={I18n.t('PasswordError1')}
        hasError={password.hasError}>
        <CPNInput
          value={password.value}
          onChangeText={value => passwordSet({value, hasError: false})}
          secureTextEntry={secureTextEntry}
          onPressRightIcon={() => secureTextEntrySet(d => !d)}
        />
      </CPNFormItem>
    );
  }

  async function loginAuth(pwd: string, userId?: string) {
    if (!userInfo.token) {
      userInfoSet(val => ({...val, hasError: true}));
      return Promise.reject('token');
    }

    try {
      const dbKey = AESDecrypt(userInfo.token, pwd);
      if (dbKey) {
        await getRealm(userId, dbKey);

        LS.set('last_user_id', userId || '');
        Store.update('userId', userId);
        Store.update('username', userInfo.username);
        Store.update('password', pwd);

        if (userInfo.biometriceToken) {
          Store.update('biometriceToken', userInfo.biometriceToken);
        }

        if (userInfo.web_dav) {
          try {
            const WebDAVDetails = JSON.parse(AESDecrypt(userInfo.web_dav, pwd));
            const WebDAV = createWebDAV(WebDAVDetails);
            Store.update('WebDAVObject', WebDAV);
            const enabled = await LS.get('web_dav_auto_sync');
            enabled && (await recoveryFromWebDAV(false));
          } catch (error) {
            CusLog.error('SignIn', 'WebDAV', error);
          }
        }

        Store.update('isSignIn', true);
        navigation.replace('Tabbar', {screen: 'HomePage'});
      } else {
        return Promise.reject('password');
      }
    } catch (error) {
      CusLog.error('SignIn', 'loginAuth', error);
      return Promise.reject('password');
    }
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          children={I18n.t('SignIn')}
          onPress={async () => {
            if (!userInfo.token) {
              userInfoSet(val => ({...val, hasError: true}));
              return;
            }
            if (!password.value) {
              passwordSet(val => ({...val, hasError: true}));
              return;
            }

            try {
              await loginAuth(password.value, userInfo.id);
            } catch (error: any) {
              if (error === 'password') {
                passwordSet(val => ({...val, hasError: true}));
              }
            }
          }}
        />
      </View>
    );
  }

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics.isSensorAvailable().then(async ({available}) => {
      if (available && userInfo.biometriceToken) {
        const res = await biometrics.getUserFlag(userInfo.biometriceToken);
        availableBiometricsSet(res);
      } else {
        availableBiometricsSet(false);
      }
    });
  }, [userInfo.biometriceToken]);
  function renderBiometrics() {
    if (!availableBiometrics) {
      return null;
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <TouchableOpacity
          accessibilityLabel={I18n.t('BiometricsSignIn')}
          style={{padding: 10}}
          onPress={async () => {
            try {
              if (!userInfo.biometriceToken) {
                return;
              }
              const res = await biometrics.getUser(userInfo.biometriceToken);
              await loginAuth(res.password, userInfo.id);
            } catch (error) {
              CusLog.error('SignInPage', 'BiometricsSignIn', error);
              CPNAlert.alert('', I18n.t('BiometricsError2'));
            }
          }}>
          <CPNIonicons name={IONName.FingerPrint} color={Colors.theme} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderGoAccountManagementButton() {
    return (
      <View>
        <CPNDivisionLine style={{marginVertical: 30}} />
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AccountManagementPage');
            }}>
            <CPNText
              style={{color: Colors.theme, textDecorationLine: 'underline'}}>
              {I18n.t('AccountManagement')}
            </CPNText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderGoAboutButton() {
    return (
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AboutPage');
          }}>
          <CPNText
            style={{color: Colors.theme, textDecorationLine: 'underline'}}>
            {I18n.t('About')}
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CPNPageView title={I18n.t('AppTitle')}>
      <View
        style={{
          height: 160,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CPNImage name="logoGreen" size={200} />
      </View>
      <View style={{flex: 1, padding: 20, justifyContent: 'space-between'}}>
        <View>
          {renderUserInfoInput()}
          {renderPasswordInput()}
          {renderSubmitButton()}
          {renderBiometrics()}
          {renderGoAccountManagementButton()}
        </View>
        <View>{renderGoAboutButton()}</View>
      </View>
    </CPNPageView>
  );
}
