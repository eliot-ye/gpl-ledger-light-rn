import {CreateReactiveConstant} from '@/libs/CreateReactiveConstant';

const colorsDefault = {
  theme: '#1989fa',
  themeTransparent: 'rgba(25, 137, 250, 0.2)',
  themeLight: '#CAE0F7',

  warning: '#F2B85F',

  success: '#41b883',
  successTransparent: 'rgba(65, 184, 131, 0.2)',
  successLight: '#D0EEE0',

  fail: '#FF1E2F',
  failTransparent: 'rgba(255, 30, 47, 0.2)',
  failLight: '#FFBBC0',

  transparent: 'transparent',

  backgroundTheme: '#eee',
  backgroundPanel: '#fff',
  backgroundDisabled: '#c8c9cc',
  backgroundBlack: '#000',
  backgroundModal: 'rgba(0,0,0,0.5)',

  shadow: '#000',
  line: '#bbb',

  fontTitle: '#000',
  fontSubtitle: '#8E8E93',
  fontText: '#222',
  fontPlaceholder: '#999',

  fontTitleReverse: '#fff',
  fontSubtitleReverse: '#fff',
  fontTextReverse: '#fff',
} as const;

const colorsDark = {
  ...colorsDefault,
  theme: '#00263A',
} as const;

export enum ThemeCode {
  default = 'light',
  dark = 'dark',
}

/** 只有组件内使用时才具有反应性 */
export const Colors = CreateReactiveConstant({
  [ThemeCode.default]: colorsDefault,
  [ThemeCode.dark]: colorsDark,
});
