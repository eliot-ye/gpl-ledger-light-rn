import ReactNativeBiometrics from 'react-native-biometrics';
import 'react-native-get-random-values';
import {MD5} from 'crypto-js';
import {I18n} from '@/assets/I18n';
import {CusLog, getRandomStrMD5} from '@/utils/tools';
import {LSRealmStorage} from '@/store/localStorage';
import {AESDecrypt, AESEncrypt} from '@/utils/encoding';

interface Option {
  promptMessage?: string;
  cancelButtonText?: string;
  authenticationFailedMessage?: string;
  dataRetrievalFailedMessage?: string;
  allowDeviceCredentials?: boolean;
}

export function createBiometrics(option: Option = {}) {
  const {
    promptMessage = I18n.t('BiometricsDescription'),
    cancelButtonText = I18n.t('Cancel'),
    authenticationFailedMessage = I18n.t('BiometricsError'),
    dataRetrievalFailedMessage = I18n.t('BiometricsError1'),
    allowDeviceCredentials = true,
  } = option;

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials,
  });

  const Biometrics = {
    async isSensorAvailable() {
      const hasAnySensors = await rnBiometrics.isSensorAvailable();
      CusLog.success('biometrics', 'isSensorAvailable', hasAnySensors);
      return {available: hasAnySensors.available};
    },

    async setData(opt: {
      promptMessage?: string;
      cancelButtonText?: string;
      biometrics?: boolean;
      payload: string;
    }) {
      if (opt.biometrics) {
        const res = await rnBiometrics.simplePrompt({
          promptMessage: opt.promptMessage || promptMessage,
          cancelButtonText: opt.cancelButtonText || cancelButtonText,
        });
        if (!res.success) {
          CusLog.error('biometrics', 'setData', res.error);
          return Promise.reject(authenticationFailedMessage);
        }
      }

      const encryptKey = getRandomStrMD5();
      const encryptData = AESEncrypt(
        opt.payload,
        MD5(encryptKey).toString() + encryptKey,
      );
      const encryptDataMD5 = MD5(encryptData).toString();

      await LSRealmStorage.set(
        encryptDataMD5,
        AESEncrypt(
          JSON.stringify({encryptKey, encryptData}),
          encryptDataMD5 + MD5(encryptDataMD5).toString(),
        ),
      );

      return encryptDataMD5;
    },

    async getData(opt: {
      promptMessage?: string;
      cancelButtonText?: string;
      token: string;
    }) {
      const res = await rnBiometrics.simplePrompt({
        promptMessage: opt.promptMessage || promptMessage,
        cancelButtonText: opt.cancelButtonText || cancelButtonText,
      });
      if (!res.success) {
        CusLog.error('biometrics', 'getData', res.error);
        return Promise.reject(authenticationFailedMessage);
      }

      const encryptStr1 = await LSRealmStorage.get(opt.token);
      if (!encryptStr1) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      const dataStr1 = AESDecrypt(
        encryptStr1,
        opt.token + MD5(opt.token).toString(),
      );
      if (!dataStr1) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      const data1 = JSON.parse(dataStr1);

      const dataStr2 = AESDecrypt(
        data1.encryptData,
        MD5(data1.encryptKey).toString() + data1.encryptKey,
      );
      if (!dataStr2) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      return JSON.parse(dataStr2);
    },

    async getDataFlag(token: string) {
      const encryptStr = await LSRealmStorage.get(token);
      return !!encryptStr;
    },

    async deleteData(opt: {
      promptMessage?: string;
      cancelButtonText?: string;
      token: string;
    }) {
      const res = await rnBiometrics.simplePrompt({
        promptMessage: opt.promptMessage || promptMessage,
        cancelButtonText: opt.cancelButtonText || cancelButtonText,
      });
      if (!res.success) {
        CusLog.error('biometrics', 'deleteData', res.error);
        return Promise.reject(authenticationFailedMessage);
      }
      await LSRealmStorage.remove(opt.token);
    },
  } as const;

  return Biometrics;
}
