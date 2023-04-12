import {
  CPNButton,
  CPNDropdown,
  CNPInput,
  CPNPageView,
  CPNText,
  DataConstraint,
} from '@/components/base';
import {Colors} from '@/configs/colors';
import {LSUserInfo, LS_UserInfo, LS_LastUserId} from '@/store/localStorage';
import {AESDecrypt} from '@/utils/tools';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {PageProps} from '../Router';
import {StoreRoot, StoreUserInfo} from '@/store';
import {getRealm} from '@/database/main';

export function SignInPage() {
  const navigation = useNavigation<PageProps<'SignInPage'>['navigation']>();

  const RootDispatch = StoreRoot.useDispatch();
  const UserInfoDispatch = StoreUserInfo.useDispatch();

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
        <CPNText style={{color: Colors.theme, marginBottom: 10}}>用户</CPNText>
        <CPNDropdown
          selectPlaceholder={
            useInfoListMemo.length > 0 ? '请选择用户' : '请注册用户'
          }
          data={useInfoListMemo}
          checked={userInfo.value}
          onSelect={data => {
            userInfoSet(data);
          }}
        />
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
        <CNPInput
          value={password.value}
          onChangeText={value => passwordSet({value, hasError: false})}
          secureTextEntry={secureTextEntry}
          onPressRightIcon={() => secureTextEntrySet(d => !d)}
          label="密码"
          placeholder="请输入密码"
          errorText="请输入有效密码"
          hasError={password.hasError}
        />
      </View>
    );
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          text="提交"
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

                UserInfoDispatch('userId', userInfo.id || '');
                UserInfoDispatch('dbKey', dbKey);
                RootDispatch('isSignIn', true);
              } else {
                passwordSet(val => ({...val, hasError: true}));
              }
            } catch (error) {
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
            注册用户
          </CPNText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <CPNPageView titleText="登入" keyboardShouldPersistTaps="handled">
      <View style={{padding: 20}}>
        {renderUserInfoInput()}
        {renderPasswordInput()}
        {renderSubmitButton()}
        {renderGoSignUpButton()}
      </View>
    </CPNPageView>
  );
}
