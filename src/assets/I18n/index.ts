import LocalizedStrings from 'react-native-localization';
import {createReactI18n} from '@/libs/ReactI18n';
import type {Locale} from 'date-fns';

import {zhCN, enUS} from 'date-fns/locale';
import zhHansTextCollection from './zhHans';
import enTextCollection from './en';

export enum LangCode {
  zhHans = 'zh-Hans',
  en = 'en',
}

export const localeList: {langCode: LangCode; locale: Locale}[] = [
  {langCode: LangCode.zhHans, locale: zhCN},
  {langCode: LangCode.en, locale: enUS},
];

interface LangItem {
  label: string;
  code: LangCode;
  scope: ReadonlyArray<string>;
}
export const langList: ReadonlyArray<Readonly<LangItem>> = [
  {
    label: '简体中文',
    code: LangCode.zhHans,
    scope: ['zh-Hans', 'zh-CN', 'zh-SG', 'zh-MO'],
  },
  {label: 'English', code: LangCode.en, scope: ['en']},
];

const Localized = new LocalizedStrings({
  [LangCode.zhHans]: {},
  [LangCode.en]: {},
});
let defaultLang = LangCode.zhHans as LangCode;
const InterfaceLanguage = Localized.getInterfaceLanguage();
langList.forEach(_langItem => {
  const _target = _langItem.scope.find(_scopeItem =>
    InterfaceLanguage.toLowerCase().includes(_scopeItem.toLowerCase()),
  );
  if (_target) {
    defaultLang = _langItem.code;
  }
});
export const langDefault = defaultLang;

/** 只有组件内使用时才具有反应性 */
export const I18n = createReactI18n(
  {
    [LangCode.zhHans]: zhHansTextCollection,
    [LangCode.en]: {...zhHansTextCollection, ...enTextCollection} as const,
  },
  {defaultLang},
);
