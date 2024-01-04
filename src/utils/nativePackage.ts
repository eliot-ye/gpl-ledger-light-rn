import {NativeModules, Platform} from 'react-native';

export const nativePackage = {
  /**
   * 设置 android 平台是否可以截屏
   * - platform: android
   */
  async setFlag(flagSecure: boolean) {
    if (Platform.OS === 'android' && NativeModules.FlagSecure) {
      if (flagSecure) {
        NativeModules.FlagSecure.setFlag();
      } else {
        NativeModules.FlagSecure.clearFlag();
      }
    }
  },
};
