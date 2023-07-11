import {I18n} from '@/assets/I18n';
import SInfo from 'react-native-sensitive-info';
import {Platform} from 'react-native';
import {CusLog} from './tools';

interface UserInfo {
  userId: string;
  password: string;
}

export const biometrics = {
  isSensorAvailable: async () => {
    CusLog.success('biometrics', 'isSensorAvailable');
    const hasAnySensors = await SInfo.isSensorAvailable();
    CusLog.success('biometrics', 'hasAnySensors', hasAnySensors);

    if (Platform.OS === 'android') {
      const hasAnyFingerprintsEnrolled = await SInfo.hasEnrolledFingerprints();
      return {available: !!hasAnySensors && hasAnyFingerprintsEnrolled};
    }

    return {available: !!hasAnySensors};
  },

  async getUserFlag(userKey: string): Promise<'true' | 'null'> {
    return SInfo.getItem(`${userKey}-flag`, {}) as any;
  },

  async getUser(userKey: string): Promise<UserInfo> {
    const protectedData = await SInfo.getItem(userKey, {
      touchID: true,
      showModal: true, //required (Android) - Will prompt user's fingerprint on Android
      strings: {
        // optional (Android) - You can personalize your prompt
        header: I18n.BiometricsSignIn,
        description: I18n.BiometricsDescription,
        hint: I18n.BiometricsDescription,
        success: I18n.BiometricsSuccess,
        notRecognized: I18n.NotRecognized,
        cancel: I18n.Cancel,
        cancelled: I18n.Cancelled,
      },
      // required (iOS) -  A fallback string for iOS
      kSecUseOperationPrompt: I18n.BiometricsDescription,
    });

    return JSON.parse(protectedData);
  },

  async setUser(userKey: string, userInfo: UserInfo) {
    await Promise.all([
      SInfo.setItem(`${userKey}-flag`, 'true', {}),
      SInfo.setItem(userKey, JSON.stringify(userInfo), {
        touchID: true,
        showModal: true,
        strings: {
          // optional (Android) - You can personalize your prompt
          header: I18n.BiometricsSignIn,
          description: I18n.BiometricsDescription,
          hint: I18n.BiometricsDescription,
          success: I18n.BiometricsSuccess,
          notRecognized: I18n.NotRecognized,
          cancel: I18n.Cancel,
          cancelled: I18n.Cancelled,
        },
        kSecAccessControl: 'kSecAccessControlBiometryAny', // optional - Add support for FaceID
      }),
    ]);
  },

  async deleteUser(userKey: string) {
    await Promise.all([
      SInfo.deleteItem(`${userKey}-flag`, {}),
      SInfo.deleteItem(userKey, {
        touchID: true,
        showModal: true,
        kSecAccessControl: 'kSecAccessControlBiometryAny', // optional - Add support for FaceID
      }),
    ]);
  },
};
