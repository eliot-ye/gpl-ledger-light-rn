import {colorsDefault} from './default';

export const colorsDark = {
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
