import {NativeModules, Platform} from 'react-native';

export const nativePackage = {
  /**
   * 设置 android 平台是否可以截屏
   * - platform: android
   */
  setFlag: async (flagSecure: boolean) => {
    if (Platform.OS === 'android') {
      if (flagSecure) {
        return NativeModules.FlagSecure.setFlag();
      } else {
        return NativeModules.FlagSecure.clearFlag();
      }
    }
  },
};
