import LocalizedStrings from 'react-native-localization';
import zhHansTextCollection from './zhHans';
import enTextCollection from './en';

export enum LangCode {
  zhHans = 'zh-Hans',
  en = 'en',
}

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

/** 只有组件内使用时才具有反应性 */
export const I18n = new LocalizedStrings({
  [LangCode.zhHans]: zhHansTextCollection,
  [LangCode.en]: {...zhHansTextCollection, ...enTextCollection} as const,
});

let defaultLang = LangCode.zhHans;
const InterfaceLanguage = I18n.getInterfaceLanguage();
langList.forEach(_langItem => {
  const _target = _langItem.scope.find(_scopeItem =>
    InterfaceLanguage.toLowerCase().includes(_scopeItem.toLowerCase()),
  );
  if (_target) {
    defaultLang = _langItem.code;
  }
});
export const langDefault = defaultLang;
