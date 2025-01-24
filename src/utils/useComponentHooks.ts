import {I18n} from '@/assets/I18n';
import {CPNToast} from '@/components/base';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';
import ScreenCapture from 'rtn-screen-capture';

export function useComponentScreenCaptureFlag() {
  useEffect(() => {
    ScreenCapture.setFlag(true);
    const ESub = ScreenCapture.addListener('takeScreenshot', () => {
      // 截屏事件
      CPNToast.open(I18n.t('ScreenshotDetectedTips'));
    });

    return () => {
      ESub.remove();
      ScreenCapture.setFlag(false);
    };
  }, []);
}

/**
 * - `iOS` - prevent default back action
 * - `Android` - `backHandle`
 * @param backHandle - ***use memoized***. `Android` back button handle. return true to prevent default back action
 */
export function useComponentPageBack(backHandle: () => boolean) {
  const navigation = useNavigation();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandle);
    navigation.setOptions({gestureEnabled: false});
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandle);
      navigation.setOptions({gestureEnabled: true});
    };
  }, [backHandle, navigation]);
}
