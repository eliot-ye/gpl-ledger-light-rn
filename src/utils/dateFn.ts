import {I18n, localeList} from '@/assets/I18n';
import {format} from 'date-fns';

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
