import {I18n} from '@/assets/I18n';
import {CNPFormItem, CNPInput} from '@/components';
import {CPNButton, CPNPageView} from '@/components/base';
import {getRealm} from '@/database/main';
import {StoreRoot, StoreUserInfo} from '@/store';
import {LS_UserInfo} from '@/store/localStorage';
import {AESEncrypt, getRandomStr, getRandomStrMD5} from '@/utils/tools';
import React, {useState} from 'react';
import {View} from 'react-native';

export function SignUpPage() {
  const RootDispatch = StoreRoot.useDispatch();
  const UserInfoDispatch = StoreUserInfo.useDispatch();

  interface FormData {
    username: string;
    password: string;
  }
  const [formData, formDataSet] = useState<FormData>({
    username: '',
    password: '',
  });
  const [formDataError, formDataErrorSet] = useState<ErrorItem<FormData>>({
    username: '',
    password: '',
  });

  function renderUsernameInput() {
    return (
      <CNPFormItem
        style={{paddingBottom: 10}}
        title={I18n.Username}
        errorText={formDataError.username}
        hasError={!!formDataError.username}>
        <CNPInput
          value={formData.username}
          onChangeText={username => {
            formDataSet({...formData, username});
            formDataErrorSet({...formData, username: ''});
          }}
          placeholder={I18n.UsernamePlaceholder}
        />
      </CNPFormItem>
    );
  }

  const [secureTextEntry, secureTextEntrySet] = useState(true);
  function renderPasswordInput() {
    return (
      <CNPFormItem
        style={{paddingBottom: 30}}
        title={I18n.Password}
        errorText={I18n.PasswordError1}
        hasError={!!formDataError.password}>
        <CNPInput
          value={formData.password}
          onChangeText={password => {
            formDataSet({...formData, password});
            formDataErrorSet({...formDataError, password: ''});
          }}
          placeholder={I18n.PasswordPlaceholder}
          secureTextEntry={secureTextEntry}
          onPressRightIcon={() => secureTextEntrySet(d => !d)}
        />
      </CNPFormItem>
    );
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          text={I18n.Submit}
          onPress={async () => {
            const _formDataError: ErrorItem<FormData> = {};

            if (!formData.username) {
              _formDataError.username = I18n.UsernameError1;
            }
            if (!formData.password) {
              _formDataError.password = I18n.PasswordError1;
            }

            if (
              Object.keys(_formDataError)
                .map(item => !!item)
                .includes(true)
            ) {
              formDataErrorSet(_formDataError);
              return;
            }

            const id = getRandomStr();
            const dbKey = getRandomStrMD5() + getRandomStrMD5();

            await getRealm(id, dbKey);

            await LS_UserInfo.set({
              id,
              username: formData.username,
              token: AESEncrypt(dbKey, formData.password),
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
    <CPNPageView titleText={I18n.SignUp} keyboardShouldPersistTaps="handled">
      <View style={{padding: 20}}>
        {renderUsernameInput()}
        {renderPasswordInput()}
        {renderSubmitButton()}
      </View>
    </CPNPageView>
  );
}
