import {I18n, LangCode} from '@/assets/I18n';
import {Locale, format} from 'date-fns';
import {zhCN, enUS} from 'date-fns/locale';

const localeList: {langCode: LangCode; locale: Locale}[] = [
  {langCode: LangCode.zhHans, locale: zhCN},
  {langCode: LangCode.en, locale: enUS},
];

export function formatDateMonth(date: number | Date) {
  const langCode = I18n.getLangCode();
  const localeItem = localeList.find(item => item.langCode === langCode);
  return format(date, I18n.t('formatDateMonth'), {locale: localeItem?.locale});
}

export function formatDateFull(date: number | Date) {
  const langCode = I18n.getLangCode();
  const localeItem = localeList.find(item => item.langCode === langCode);
  return format(date, I18n.t('formatDateFull'), {locale: localeItem?.locale});
}

export function formatDateTime(date: number | Date) {
  const langCode = I18n.getLangCode();
  const localeItem = localeList.find(item => item.langCode === langCode);
  return format(date, I18n.t('formatDateTime'), {locale: localeItem?.locale});
}
