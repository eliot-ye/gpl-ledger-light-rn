import React from 'react';
import {Dimensions, Linking, Platform, ScrollView} from 'react-native';
import {CEnvVariable, envConstant, setAppEnv} from './env';
import {AlertButton, CPNAlert, CPNRichTextView} from '@/components/base';
import {I18n, LangCode} from '@/assets/I18n';
import {LS} from '@/store/localStorage';
import {Colors} from './colors';

enum Error {
  NO_CONTROL_PATH = 'NO_CONTROL_PATH',
  NO_CONTROL_JSON = 'NO_CONTROL_JSON',
  IS_NOT_JSON = 'IS_NOT_JSON',
}

interface ControlJSON extends CEnvVariable {
  versionName: string;
  platform: (typeof Platform.OS)[];
  alert?: ControlJSONAlert;
}

interface ControlJSONAlert {
  /** 如果有值，则相同ID的弹窗只显示一次 */
  onceId?: string;
  title?: string;
  message?: string;
  /** 富文本 `message` 字符串。如果有值，则覆盖 `message` */
  richTextMessage?: string;
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
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  i18n?: ControlJSONAlertI18nItem[];
}
interface ControlJSONAlertI18nItem {
  langCode: LangCode;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export async function getControlJSON() {
  if (!envConstant.envControlPath) {
    return Promise.reject(Error.NO_CONTROL_PATH);
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
        return Promise.reject(Error.NO_CONTROL_JSON);
      }
      return controlJSON;
    } catch (error) {
      return Promise.reject(Error.IS_NOT_JSON);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(I18n.t('NetworkError'));
  }
}

export async function injectControlJSON() {
  let controlJSON: ControlJSON | undefined;
  try {
    controlJSON = await getControlJSON();
  } catch (error) {
    return error;
  }

  if (!controlJSON) {
    return Error.NO_CONTROL_JSON;
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

    let title: React.ReactNode = alert.title;
    let message: React.ReactNode = alert.message;
    let confirmText = alert.confirmText;
    let cancelText = alert.cancelText;

    if (alert.i18n) {
      const _i18nItem = alert.i18n.find(
        _item => _item.langCode === I18n.getLangCode(),
      );
      title = _i18nItem?.title || title;
      message = _i18nItem?.message || message;
      confirmText = _i18nItem?.confirmText || confirmText;
      cancelText = _i18nItem?.cancelText || cancelText;
    }
    if (alert.richTextMessage) {
      message = React.createElement(CPNRichTextView, {
        richText: `<div style="font-size: 16px">${alert.richTextMessage}<div>`,
      });
    }

    const buttons: AlertButton<any>[] = [
      {
        text: confirmText || I18n.t('Confirm'),
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
        text: cancelText || I18n.t('Cancel'),
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
