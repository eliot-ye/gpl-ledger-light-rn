import {I18n, LangCode} from '@/assets/I18n';
import {Locale, format} from 'date-fns';
import {zhCN, enUS} from 'date-fns/locale';

const localeList: {langCode: LangCode; locale: Locale}[] = [
  {langCode: LangCode.zhHans, locale: zhCN},
  {langCode: LangCode.en, locale: enUS},
];

export function formatDate(date: number | Date) {
  const langCode = I18n.getLanguage();
  const localeItem = localeList.find(item => item.langCode === langCode);
  return format(date, I18n.formatDate, {locale: localeItem?.locale});
}