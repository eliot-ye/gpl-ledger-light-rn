import {createReactConstant} from '@/libs/ReactConstant';
import {colorsDefault} from './default';
import {colorsDark} from './dark';

export enum ThemeCode {
  default = 'light',
  dark = 'dark',
}

export const ColorsInstance = createReactConstant({
  [ThemeCode.default]: colorsDefault,
  [ThemeCode.dark]: {...colorsDefault, ...colorsDark},
});
export const {Constant: Colors} = ColorsInstance;
