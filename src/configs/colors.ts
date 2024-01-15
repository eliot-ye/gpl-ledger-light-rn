import {createReactConstant} from '@/libs/ReactConstant';

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
  theme: '#0E639C',
  backgroundTheme: '#252526',
  backgroundPanel: '#333333',
  backgroundDisabled: '#777777',
  backgroundModal: 'rgba(0,0,0,0.3)',

  shadow: '#333333',
  line: '#414141',

  fontTitle: '#CCCCCC',
  fontSubtitle: '#989898',
  fontText: '#C6C6C6',
} as const;

export enum ThemeCode {
  default = 'light',
  dark = 'dark',
}

export const ColorsInstance = createReactConstant({
  [ThemeCode.default]: colorsDefault,
  [ThemeCode.dark]: colorsDark,
});
export const {Constant: Colors} = ColorsInstance;
