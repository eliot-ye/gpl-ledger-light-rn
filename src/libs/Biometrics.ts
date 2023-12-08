import ReactNativeBiometrics from 'react-native-biometrics';
import {I18n} from '@/assets/I18n';
import {CusLog, getRandomStrMD5} from '@/utils/tools';
import {LSRealmStorage} from '@/store/localStorage';
import {AESDecrypt, AESEncrypt, MD5} from '@/utils/encoding';
import {envConstant} from '@/configs/env';

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
    allowDeviceCredentials = false,
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
      const encryptStr = AESEncrypt(opt.payload, envConstant.salt + encryptKey);
      const encryptStrMD5 = MD5(encryptStr);

      await LSRealmStorage.set(encryptStrMD5, encryptStr);
      await LSRealmStorage.set(
        MD5(encryptStrMD5),
        AESEncrypt(encryptKey, MD5(envConstant.salt + encryptStrMD5)),
      );

      return encryptStrMD5;
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

      const encryptStr1 = await LSRealmStorage.get(MD5(opt.token));
      if (!encryptStr1) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      const encryptKey = AESDecrypt(
        encryptStr1,
        MD5(envConstant.salt + opt.token),
      );

      const encryptStr2 = await LSRealmStorage.get(opt.token);
      if (!encryptStr2) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      const dataStr = AESDecrypt(encryptStr2, envConstant.salt + encryptKey);
      if (!dataStr) {
        return Promise.reject(dataRetrievalFailedMessage);
      }
      return JSON.parse(dataStr);
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
      await LSRealmStorage.remove(MD5(opt.token));
    },
  } as const;

  return Biometrics;
}
