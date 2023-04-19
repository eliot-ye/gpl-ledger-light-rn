import {
  CPNButton,
  CPNDropdown,
  CPNPageView,
  CPNText,
  DataConstraint,
  CPNFormItem,
  CPNInput,
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

export function SignInPage() {
  const navigation = useNavigation<PageProps<'SignInPage'>['navigation']>();

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
      <View style={{paddingBottom: 20}}>
        <CPNFormItem title={I18n.Username}>
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
      </View>
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
      <View style={{paddingBottom: 30}}>
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
            placeholder={I18n.PasswordPlaceholder}
          />
        </CPNFormItem>
      </View>
    );
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          text={I18n.Submit}
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
              const dbKey = AESDecrypt(userInfo.token, password.value);
              if (dbKey) {
                await getRealm(userInfo.id, dbKey);

                RootDispatch('isSignIn', true);
                navigation.replace('Tabbar', {screen: 'HomePage'});
              } else {
                passwordSet(val => ({...val, hasError: true}));
              }
            } catch (error) {
              console.error(error);
              passwordSet(val => ({...val, hasError: true}));
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
          paddingTop: 10,
          paddingRight: 16,
          flexDirection: 'row',
          justifyContent: 'flex-end',
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

  return (
    <CPNPageView titleText={I18n.SignIn} keyboardShouldPersistTaps="handled">
      <View style={{padding: 20}}>
        {renderUserInfoInput()}
        {renderPasswordInput()}
        {renderSubmitButton()}
        {renderGoSignUpButton()}
      </View>
    </CPNPageView>
  );
}
