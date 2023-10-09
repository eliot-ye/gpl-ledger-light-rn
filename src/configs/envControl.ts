import {Linking, Platform, ScrollView, View} from 'react-native';
import {CEnvVariable, envConstant, setAppEnv} from './env';
import {AlertButton, CPNAlert, CPNRichTextView} from '@/components/base';
import {I18n, LangCode} from '@/assets/I18n';
import React from 'react';

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
  title?: string;
  message?: string;
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
  /** 默认: undefined, 如果有高度, 则使用 `CPNRichTextView` 渲染 `<div style="text-align: center; font-size: 16px">${props.message}<div>` */
  richTextScrollViewHeight?: number;
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
    if (alert.richTextScrollViewHeight) {
      message = React.createElement(
        View,
        {style: {height: alert.richTextScrollViewHeight}},
        React.createElement(
          ScrollView,
          {style: {flex: 1}},
          React.createElement(CPNRichTextView, {
            richText: `<div style="text-align: center; font-size: 16px">${message}<div>`,
          }),
        ),
      );
    }

    const buttons: AlertButton[] = [
      {
        text: confirmText || I18n.t('Confirm'),
        keep: !alert.confirmClose,
        async onPress() {
          if (alert.confirmOpenURL) {
            await Linking.openURL(alert.confirmOpenURL);
          }
        },
      },
    ];

    if (alert.showCancel) {
      buttons.unshift({
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
      message,
      backButtonClose: alert.showCancel,
      buttons,
    });
  }
}
