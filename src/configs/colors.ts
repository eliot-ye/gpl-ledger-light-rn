import {createReactiveConstant} from '@/libs/ReactiveConstant';

const colorsDefault = {
  theme: '#03A850',

  warning: '#F2B85F',

  success: '#41b883',
  successTransparent: 'rgba(65, 184, 131, 0.2)',

  fail: '#FF1E2F',
  failTransparent: 'rgba(255, 30, 47, 0.2)',

  transparent: 'transparent',

  backgroundTheme: '#efefef',
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

  shadow: '#fff',
  line: '#bbb',
} as const;

export enum ThemeCode {
  default = 'light',
  dark = 'dark',
}

/** 只有组件内使用时才具有反应性 */
export const Colors = createReactiveConstant({
  [ThemeCode.default]: colorsDefault,
  [ThemeCode.dark]: colorsDark,
});
