import React from 'react';
import {Dimensions, Linking, Platform, ScrollView} from 'react-native';
import {CEnvVariable, envConstant, setAppEnv} from './env';
import {
  AlertButton,
  CPNAlert,
  CPNRichTextView,
  CPNText,
} from '@/components/base';
import {I18n, LangCode} from '@/assets/I18n';
import {LS} from '@/store/localStorage';
import {Colors} from './colors';

export enum Error {
  NETWORK_ERROR = 'NETWORK_ERROR',
  NO_CONTROL_PATH = 'NO_CONTROL_PATH',
  NO_CONTROL_JSON = 'NO_CONTROL_JSON',
  IS_NOT_JSON = 'IS_NOT_JSON',
}
export interface ErrorItem {
  code: Error;
  message?: string;
}

interface ControlJSON extends CEnvVariable {
  versionName: string;
  platform: (typeof Platform.OS)[];
  alert?: ControlJSONAlert;
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
  /** 点击确认按钮退出 app */
  confirmExitApp?: boolean;
  /** 点击取消按钮退出 app */
  cancelExitApp?: boolean;
  /** 点击确认按钮打开链接 */
  confirmOpenURL?: string;
  /** 点击取消按钮打开链接 */
  cancelOpenURL?: string;
  /** 点击确认按钮关闭弹窗 */
  confirmClose?: boolean;
  showCancel?: boolean;
  i18n?: ControlJSONAlertI18nItem[];
}

export async function getControlJSON() {
  if (!envConstant.envControlPath) {
    return Promise.reject({code: Error.NO_CONTROL_PATH} as ErrorItem);
  }
  try {
    const res = await fetch(envConstant.envControlPath);
    const _text = await res.text();
    try {
      const jsonList = JSON.parse(_text) as ControlJSON[];
      const controlJSON = jsonList.find(
        _item =>
          _item.platform.includes(Platform.OS) &&
          _item.versionName === envConstant.versionName,
      );
      if (!controlJSON) {
        return Promise.reject({code: Error.NO_CONTROL_JSON} as ErrorItem);
      }
      return controlJSON;
    } catch (error) {
      return Promise.reject({code: Error.IS_NOT_JSON} as ErrorItem);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject({
      code: Error.NETWORK_ERROR,
      message: I18n.t('NetworkError'),
    } as ErrorItem);
  }
}

export async function injectControlJSON() {
  let controlJSON: ControlJSON | undefined;
  try {
    controlJSON = await getControlJSON();
  } catch (error) {
    return error as ErrorItem;
  }

  if (!controlJSON) {
    return {code: Error.NO_CONTROL_JSON} as ErrorItem;
  }

  setAppEnv(controlJSON);

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
        textColor: Colors.theme,
        keep: !alert.confirmClose,
        async onPress() {
          if (alert.confirmOpenURL) {
            await Linking.openURL(alert.confirmOpenURL);
          }
        },
      },
    ];

    if (alert.showCancel) {
      buttons.push({
        text: cancelText ?? I18n.t('Cancel'),
        async onPress() {
          if (alert.cancelOpenURL) {
            await Linking.openURL(alert.cancelOpenURL);
          }
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
}
