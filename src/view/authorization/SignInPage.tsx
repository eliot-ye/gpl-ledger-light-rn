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
} from '@/components/base';
import {Colors} from '@/configs/colors';
import {LSUserInfo, LS_UserInfo, LS_LastUserId} from '@/store/localStorage';
import {AESDecrypt} from '@/utils/tools';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {PageProps} from '../Router';
import {StoreRoot} from '@/store';
import {getRealm} from '@/database/main';
import {I18n} from '@/assets/I18n';
import {biometrics} from '@/utils/biometrics';
import {SessionStorage} from '@/store/sessionStorage';

export function SignInPage() {
  const navigation = useNavigation<PageProps<'SignInPage'>['navigation']>();

  StoreRoot.useState();
  const RootDispatch = StoreRoot.useDispatch();

  const [useInfoList, useInfoListSet] = useState<LSUserInfo[]>([]);
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
      <CPNFormItem style={{paddingBottom: 20}} title={I18n.Username}>
        <CPNDropdown
          selectPlaceholder={
            useInfoListMemo.length > 0
              ? I18n.SelectUser
              : I18n.PleaseRegisterUser
          }
          data={useInfoListMemo}
          checked={userInfo.value}
          onSelect={data => {
            userInfoSet(data);
          }}
        />
      </CPNFormItem>
    );
  }

  const getUserInfo = useCallback(async () => {
    const data = await LS_UserInfo.get();
    useInfoListSet(data);
    const lastId = await LS_LastUserId.get();
    const info = data.find(item => item.id === lastId);
    if (info) {
      userInfoSet({...info, label: info.username, value: info.id});
    } else if (data[0]) {
      userInfoSet({...data[0], label: data[0].username, value: data[0].id});
    }
  }, []);
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const [password, passwordSet] = useState({value: '', hasError: false});
  const [secureTextEntry, secureTextEntrySet] = useState(true);
  function renderPasswordInput() {
    return (
      <CPNFormItem
        style={{paddingBottom: 30}}
        title={I18n.Password}
        errorText={I18n.PasswordError1}
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

        SessionStorage.setValue('userId', userId);
        SessionStorage.setValue('password', pwd);
        RootDispatch('isSignIn', true);
        navigation.replace('Tabbar', {screen: 'HomePage'});
      } else {
        return Promise.reject('password');
      }
    } catch (error) {
      console.error(error);
      return Promise.reject('password');
    }
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          children={I18n.Submit}
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

  function renderGoSignUpButton() {
    return (
      <View
        style={{
          paddingTop: 30,
          paddingRight: 16,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignUpPage');
          }}>
          <CPNText
            style={{color: Colors.theme, textDecorationLine: 'underline'}}>
            {I18n.RegisteredUsers}
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  const [availableBiometrics, availableBiometricsSet] = useState(false);
  useEffect(() => {
    biometrics.isSensorAvailable().then(async ({available}) => {
      if (available) {
        const {username} = await biometrics.getUser();
        availableBiometricsSet(userInfo.id === username);
      }
    });
  }, [userInfo.id]);
  function renderBiometrics() {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <TouchableOpacity
          onPress={async () => {
            try {
              const res = await biometrics.loginBiometricAuth();
              await loginAuth(res.password, res.username);
            } catch (error) {
              CPNAlert.open({message: I18n.BiometricsError});
            }
          }}>
          <CPNIonicons name={IONName.FingerPrint} color={Colors.theme} />
        </TouchableOpacity>
      </View>
    );
  }

  function renderGoLangSettingButton() {
    return (
      <View
        style={{
          paddingTop: 30,
          paddingRight: 16,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LangSettingPage');
          }}>
          <CPNText
            style={{color: Colors.theme, textDecorationLine: 'underline'}}>
            {I18n.LanguageSetting}
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CPNPageView title={I18n.SignIn}>
      <View style={{flex: 1, padding: 20, justifyContent: 'space-between'}}>
        <View>
          {renderUserInfoInput()}
          {renderPasswordInput()}
          {renderSubmitButton()}
          {renderGoSignUpButton()}
          {availableBiometrics && renderBiometrics()}
        </View>
        <View>{renderGoLangSettingButton()}</View>
      </View>
    </CPNPageView>
  );
}
