import {I18n} from '@/assets/I18n';
import {
  CPNButton,
  CPNPageView,
  CPNFormItem,
  CPNInput,
  CPNImage,
} from '@/components/base';
import {getRealm} from '@/database/main';
import {Store} from '@/store';
import {LS_UserInfo} from '@/store/localStorage';
import {getRandomStr, getRandomStrMD5} from '@/utils/tools';
import {AESEncrypt} from '@/utils/encoding';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {PageProps} from '../Router';

export function SignUpPage() {
  const navigation = useNavigation<PageProps<'SignUpPage'>['navigation']>();

  I18n.useLangCode();

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
      <CPNFormItem
        style={{paddingBottom: 20}}
        title={I18n.t('Username')}
        errorText={formDataError.username}
        hasError={!!formDataError.username}>
        <CPNInput
          value={formData.username}
          onChangeText={username => {
            formDataSet({...formData, username});
            formDataErrorSet({...formData, username: ''});
          }}
        />
      </CPNFormItem>
    );
  }

  const [secureTextEntry, secureTextEntrySet] = useState(true);
  function renderPasswordInput() {
    return (
      <CPNFormItem
        style={{paddingBottom: 30}}
        title={I18n.t('Password')}
        errorText={I18n.t('PasswordError1')}
        hasError={!!formDataError.password}>
        <CPNInput
          value={formData.password}
          onChangeText={password => {
            formDataSet({...formData, password});
            formDataErrorSet({...formDataError, password: ''});
          }}
          secureTextEntry={secureTextEntry}
          onPressRightIcon={() => secureTextEntrySet(d => !d)}
        />
      </CPNFormItem>
    );
  }

  function renderSubmitButton() {
    return (
      <View>
        <CPNButton
          children={I18n.t('SignUp')}
          onPress={async () => {
            const _formDataError: ErrorItem<FormData> = {};

            if (!formData.username) {
              _formDataError.username = I18n.t('UsernameError1');
            }
            if (!formData.password) {
              _formDataError.password = I18n.t('PasswordError1');
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

            Store.update('userId', id);
            Store.update('username', formData.username);
            Store.update('password', formData.password);
            Store.update('isSignIn', true);
            navigation.reset({
              routes: [{name: 'Tabbar', params: {screen: 'HomePage'}}],
            });
          }}
        />
      </View>
    );
  }

  return (
    <CPNPageView title={I18n.t('SignUp')}>
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
          {renderUsernameInput()}
          {renderPasswordInput()}
          {renderSubmitButton()}
        </View>
      </View>
    </CPNPageView>
  );
}
