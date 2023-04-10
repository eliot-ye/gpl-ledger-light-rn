import {LangCode} from '@/assets/I18n';
import {CreateReactiveConstant} from '@/libs/CreateReactiveConstant';

const dateShowDefault = {
  date: 'yyyy-MM-dd',
  time: 'HH:mm',
  dataTime: 'yyyy-MM-dd HH:mm',
} as const;

const dateShowEn = {
  ...dateShowDefault,
  date: 'dd-MM-yyyy',
} as const;

/** 只有组件内使用时才具有反应性 */
export const DateFormat = CreateReactiveConstant({
  [LangCode.zhHans]: dateShowDefault,
  [LangCode.en]: dateShowEn,
});
