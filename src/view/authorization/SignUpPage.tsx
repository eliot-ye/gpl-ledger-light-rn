import {CPNButton, CPNPageView, CNPInput} from '@/components/base';
import {Colors} from '@/configs/colors';
import {getRealm} from '@/database/main';
import {StoreRoot, StoreUserInfo} from '@/store';
import {LS_UserInfo} from '@/store/localStorage';
import {AESEncrypt, getRandomStr, getRandomStrMD5} from '@/utils/tools';
import React, {useState} from 'react';
import {View} from 'react-native';

export function SignUpPage() {
  const RootDispatch = StoreRoot.useDispatch();
  const UserInfoDispatch = StoreUserInfo.useDispatch();

  const [username, usernameSet] = useState({value: '', hasError: false});
  function renderUsernameInput() {
    return (
      <View style={{paddingBottom: 20}}>
        <CNPInput
          value={username.value}
          onChangeText={value => usernameSet({value, hasError: false})}
          placeholder="用户名称"
          errorText="用户名称不能为空"
          hasError={username.hasError}
          containerStyle={{
            backgroundColor: Colors.backgroundGrey,
          }}
        />
      </View>
    );
  }

  const [password, passwordSet] = useState({value: '', hasError: false});
  const [secureTextEntry, secureTextEntrySet] = useState(true);
  function renderPasswordInput() {
    return (
      <View style={{paddingBottom: 30}}>
        <CNPInput
          value={password.value}
          onChangeText={value => passwordSet({value, hasError: false})}
          placeholder="密码"
          secureTextEntry={secureTextEntry}
          onPressRightIcon={() => secureTextEntrySet(d => !d)}
          errorText="密码不能为空"
          hasError={password.hasError}
          containerStyle={{
            backgroundColor: Colors.backgroundGrey,
          }}
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
            if (!username.value) {
              usernameSet(val => ({...val, hasError: true}));
            }
            if (!password.value) {
              passwordSet(val => ({...val, hasError: true}));
            }

            const id = getRandomStr();
            const dbKey = getRandomStrMD5() + getRandomStrMD5();

            await getRealm(id, dbKey);

            await LS_UserInfo.set({
              id,
              username: username.value,
              token: AESEncrypt(dbKey, password.value),
            });

            UserInfoDispatch('userId', id);
            UserInfoDispatch('dbKey', dbKey);
            RootDispatch('isSignIn', true);
          }}
        />
      </View>
    );
  }

  return (
    <CPNPageView titleText="注册" keyboardShouldPersistTaps="handled">
      <View style={{padding: 20}}>
        {renderUsernameInput()}
        {renderPasswordInput()}
        {renderSubmitButton()}
      </View>
    </CPNPageView>
  );
}
