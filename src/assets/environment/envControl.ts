import React from 'react';
import {Dimensions, Linking, Platform, ScrollView} from 'react-native';
import ExitApp from 'react-native-exit-app';
import {validator} from '@exodus/schemasafe';
import SControlJSON from '../../../public/SControlJSON.json';
import {CEnvVariable, envConstant, setAppEnv} from '.';
import {
  AlertButton,
  CPNAlert,
  CPNRichTextView,
  CPNText,
} from '@/components/base';
import {I18n, LangCode} from '../I18n';
import {LS} from '@/store/localStorage';

const validateControlJSON = validator(SControlJSON);

export enum ControlJSONError {
  NETWORK_ERROR = 'NETWORK_ERROR',
  NO_CONTROL_PATH = 'NO_CONTROL_PATH',
  NO_CONTROL_JSON = 'NO_CONTROL_JSON',
  IS_NOT_CONTROL_JSON = 'IS_NOT_CONTROL_JSON',
  IS_NOT_JSON = 'IS_NOT_JSON',
  IS_BLOCK = 'IS_BLOCK',
}
export interface ControlJSONErrorItem {
  code: ControlJSONError;
  message?: string;
}

export interface ControlItem extends CEnvVariable {
  /**
   * 版本名，不能包含小版本
   *
   * 如果有重复版本，则按照 index 排序，从大到小依次覆盖
   *
   * - All - 表示所有版本
   * */
  versionName: ('All' | string)[];
  platform: (typeof Platform.OS)[];
  alert?: ControlJSONAlert;
  isForceUpdate?: boolean;
  /** 如果为true，则 APP 会阻塞在开屏页 */
  isBlock?: boolean;
}

interface ControlJSONAlertText {
  title?: string;
  message?: string;
  /** 富文本 `message` 字符串。如果有值，则覆盖 `message` */
  richTextMessage?: string;
  confirmText?: string;
  cancelText?: string;
}
interface ControlJSONAlertI18nItem extends ControlJSONAlertText {
  langCode: LangCode;
}
interface ControlJSONAlert extends ControlJSONAlertText {
  /** 如果有值，则相同ID的弹窗只显示一次 */
  onceId?: string;
  /**
   * 点击确认按钮退出 app
   * @default false
   * */
  confirmExitApp?: boolean;
  /**
   * 点击取消按钮退出 app
   * @default false
   * */
  cancelExitApp?: boolean;
  /** 点击确认按钮打开链接 */
  confirmOpenURL?: string;
  /** 点击取消按钮打开链接 */
  cancelOpenURL?: string;
  /**
   * 点击确认按钮关闭弹窗
   * @default true
   * */
  confirmClose?: boolean;
  showCancel?: boolean;
  i18n?: ControlJSONAlertI18nItem[];
}

export async function getControlJSON() {
  if (!envConstant.envControlPath) {
    return Promise.reject({
      code: ControlJSONError.NO_CONTROL_PATH,
    } as ControlJSONErrorItem);
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);
    const res = await fetch(envConstant.envControlPath, {
      headers: {
        'Cache-Control': 'no-cache',
        'User-Agent': `${envConstant.brand}/(${envConstant.model}) ${Platform.OS}/${Platform.Version} ${envConstant.bundleId}/${envConstant.versionName}.${envConstant.versionCode}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const _text = await res.text();
    const jsonList = JSON.parse(_text) as ControlItem[];

    const isValid = validateControlJSON(jsonList as any);
    if (!isValid) {
      return Promise.reject({
        code: ControlJSONError.IS_NOT_CONTROL_JSON,
        message: 'JSON is not a valid control json',
      } as ControlJSONErrorItem);
    }

    const targetJsonList = jsonList.filter(
      _item =>
        _item.platform.includes(Platform.OS) &&
        (_item.versionName.includes(envConstant.versionName) ||
          _item.versionName.includes('All')),
    );

    const controlJSON = targetJsonList.reduceRight(
      (prev, curr) => ({
        ...prev,
        ...curr,
      }),
      {} as ControlItem,
    );
    if (!controlJSON) {
      return Promise.reject({
        code: ControlJSONError.NO_CONTROL_JSON,
      } as ControlJSONErrorItem);
    }
    return controlJSON;
  } catch (error) {
    console.error('getControlJSON', error);
    return Promise.reject({
      code: ControlJSONError.NETWORK_ERROR,
      message: I18n.t('NetworkError'),
    } as ControlJSONErrorItem);
  }
}

export async function injectControlJSON() {
  let controlJSON: ControlItem | undefined;
  try {
    controlJSON = await getControlJSON();
  } catch (error) {
    return error as ControlJSONErrorItem;
  }

  if (!controlJSON) {
    return {code: ControlJSONError.NO_CONTROL_JSON} as ControlJSONErrorItem;
  }

  setAppEnv(controlJSON);

  if (controlJSON.isForceUpdate) {
    const defaultUpdateLink = Platform.select({
      android: `market://details?id=${envConstant.bundleId}`,
      ios: `itms-apps://itunes.apple.com/us/app/id${envConstant.iosAppStoreId}?mt=8`,
    });
    CPNAlert.open({
      message: I18n.t('UpdateMessage'),
      backButtonClose: false,
      buttons: [
        {
          text: I18n.t('UpdateNow'),
          onPress: async () => {
            await Linking.openURL(defaultUpdateLink!);
            return Promise.reject();
          },
        },
      ],
    });
  }

  if (controlJSON.alert) {
    const alert = controlJSON.alert;

    if (alert.onceId) {
      const oldId = await LS.get('env_alert_onceId');
      if (oldId === alert.onceId) {
        return;
      }
      LS.set('env_alert_onceId', alert.onceId);
    }

    let title = alert.title;
    let rMessage = alert.message;
    let richTextMessage = alert.richTextMessage;
    let confirmText = alert.confirmText;
    let cancelText = alert.cancelText;

    if (alert.i18n) {
      const _i18nItem = alert.i18n.find(
        _item => _item.langCode === I18n.getLangCode(),
      );
      title = _i18nItem?.title ?? title;
      rMessage = _i18nItem?.message ?? rMessage;
      richTextMessage = _i18nItem?.richTextMessage ?? richTextMessage;
      confirmText = _i18nItem?.confirmText ?? confirmText;
      cancelText = _i18nItem?.cancelText ?? cancelText;
    }

    let message: React.ReactNode = React.createElement(CPNText, {}, rMessage);
    if (richTextMessage) {
      message = React.createElement(CPNRichTextView, {
        richText: `<div style="font-size: 16px">${richTextMessage}<div>`,
      });
    }

    const buttons: AlertButton<any>[] = [
      {
        text: confirmText ?? I18n.t('Confirm'),
        async onPress() {
          try {
            if (alert.confirmOpenURL) {
              await Linking.openURL(alert.confirmOpenURL);
            }
            if (alert.confirmExitApp) {
              ExitApp.exitApp();
            }
          } catch (error) {}
          if (alert.confirmClose === false) {
            return Promise.reject();
          }
        },
      },
    ];

    if (alert.showCancel) {
      buttons.push({
        text: cancelText ?? I18n.t('Cancel'),
        async onPress() {
          try {
            if (alert.cancelOpenURL) {
              await Linking.openURL(alert.cancelOpenURL);
            }
            if (alert.cancelExitApp) {
              ExitApp.exitApp();
            }
          } catch (error) {}
        },
      });
    }

    CPNAlert.open({
      title,
      message: React.createElement(
        ScrollView,
        {style: {maxHeight: Dimensions.get('window').height / 2}},
        message,
      ),
      backButtonClose: alert.showCancel,
      buttons,
    });
  }

  if (controlJSON.isBlock) {
    return Promise.reject(ControlJSONError.IS_BLOCK);
  }
}
