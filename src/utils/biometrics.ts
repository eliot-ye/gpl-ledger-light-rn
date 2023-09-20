import {I18n} from '@/assets/I18n';
import ReactNativeBiometrics from 'react-native-biometrics';
import {CusLog} from './tools';
import {LS_BiometriceKey, LS_UserInfo} from '@/store/localStorage';
import {AESDecrypt} from './encoding';
import {AESEncrypt} from './encoding';

interface UserInfo {
  userId: string;
  password: string;
}

const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});

export const biometrics = {
  isSensorAvailable: async () => {
    const hasAnySensors = await rnBiometrics.isSensorAvailable();
    CusLog.success('biometrics', 'isSensorAvailable', hasAnySensors);
    return {available: hasAnySensors.available};
  },

  async getUserFlag(userKey: string): Promise<string | undefined> {
    const keyMap = await LS_BiometriceKey.get();
    return keyMap[userKey];
  },

  async getUser(userKey: string): Promise<UserInfo> {
    const res = await rnBiometrics.simplePrompt({
      promptMessage: I18n.t('BiometricsDescription'),
      cancelButtonText: I18n.t('Cancel'),
    });
    if (res.success) {
      const encryptKey = await this.getUserFlag(userKey);
      const userList = await LS_UserInfo.get();
      const userInfo = userList.find(_item => _item.id === userKey);
      if (!encryptKey || !userInfo || !userInfo.biometriceToken) {
        return Promise.reject();
      }
      const dataStr = AESDecrypt(userInfo.biometriceToken, encryptKey);
      return JSON.parse(dataStr);
    }
    return Promise.reject();
  },

  async setUser(userKey: string, userInfo: UserInfo) {
    const res = await rnBiometrics.simplePrompt({
      promptMessage: I18n.t('BiometricsDescription'),
      cancelButtonText: I18n.t('Cancel'),
    });
    if (res.success) {
      const {publicKey} = await rnBiometrics.createKeys();
      const encryptKey = publicKey.substring(4, 20);
      LS_BiometriceKey.set(userKey, encryptKey);
      return LS_UserInfo.update({
        id: userKey,
        biometriceToken: AESEncrypt(JSON.stringify(userInfo), encryptKey),
      });
    }
  },

  async deleteUser(userKey: string) {
    const res = await rnBiometrics.simplePrompt({
      promptMessage: I18n.t('BiometricsDescription'),
      cancelButtonText: I18n.t('Cancel'),
    });
    if (res.success) {
      return Promise.all([
        rnBiometrics.deleteKeys(),
        LS_BiometriceKey.set(userKey, ''),
        LS_UserInfo.update({id: userKey, biometriceToken: undefined}),
      ]);
    }
  },
};
