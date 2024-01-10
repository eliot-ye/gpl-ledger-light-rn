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
}
export const langList: ReadonlyArray<Readonly<LangItem>> = [
  {label: '简体中文', code: LangCode.zhHans},
  {label: 'English', code: LangCode.en},
];

/** 只有组件内使用时才具有反应性 */
export const I18n = createReactI18n(
  {
    [LangCode.zhHans]: zhHansTextCollection,
    [LangCode.en]: {...zhHansTextCollection, ...enTextCollection} as const,
  },
  {
    langScope: {
      [LangCode.zhHans]: ['zh-Hans', 'zh-CN', 'zh-SG', 'zh-MO'],
      [LangCode.en]: ['en'],
    },
    langMap: {
      [LangCode.zhHans]: {
        android: 'zh-CN',
        ios: 'zh-Hans',
      },
      [LangCode.en]: {
        android: 'en',
        ios: 'en',
      },
    },
  },
);
export const langDefault = I18n.getLangCode();
