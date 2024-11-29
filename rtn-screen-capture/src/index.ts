import {NativeEventEmitter, NativeModules} from 'react-native';
import ScreenCapture from './spec/NativeScreenCapture';

const screenCaptureEmitter = new NativeEventEmitter(
  ScreenCapture || NativeModules.ScreenCapture,
);

export default {
  /**
   * 设置是否禁止截屏。设为 true 后，在Android上会启用系统禁止截屏。在iOS上会触发`addListener`事件
   * @param flagSecure
   * @returns
   */
  setFlag(flagSecure: boolean) {
    if (!ScreenCapture) {
      return;
    }
    if (flagSecure) {
      ScreenCapture.setFlag();
    } else {
      ScreenCapture.clearFlag();
    }
  },

  /**
   * 当 setFlag true 后，截屏时触发
   * @platform ios
   */
  addListener(eventName: 'takeScreenshot', listener: () => void) {
    return screenCaptureEmitter.addListener(eventName, () => {
      listener();
    });
  },
};
