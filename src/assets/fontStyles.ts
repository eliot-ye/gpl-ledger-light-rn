import {
  Falsy,
  Platform,
  RecursiveArray,
  RegisteredStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import {LangCode} from './I18n';

type FontFamilyName = undefined;
const defaultFontFamily: FontFamilyName = undefined;
export const FontFamilyAll: FontFamilyName[] = [];

export interface CTextStyle extends TextStyle {
  fontFamily?: FontFamilyName;
}

interface FontFamilyItem {
  /** 匹配顺序：1 */
  fontFamily?: FontFamilyName;
  /** 匹配顺序：2 */
  fontWeightTarget?: CTextStyle['fontWeight'][];
  fontWeight?: CTextStyle['fontWeight'];
  /** 匹配顺序：4 */
  fontStyleTarget?: CTextStyle['fontStyle'][];
  fontStyle?: CTextStyle['fontStyle'];
  fontFamilyRaw: string;
  /** 匹配顺序：3 */
  langCode?: LangCode[];
}

function getPropsStyleForArray(
  propsStyle: RecursiveArray<Falsy | TextStyle | RegisteredStyle<TextStyle>>,
) {
  let style = {} as TextStyle;
  for (const el of propsStyle) {
    if (Array.isArray(el)) {
      style = {...style, ...getPropsStyleForArray(el)};
    } else if (typeof el === 'object') {
      style = {...style, ...el};
    }
  }
  return style;
}

export function getFontStyles(
  propsStyle: StyleProp<TextStyle>,
  langCode?: LangCode,
) {
  let style = propsStyle as CTextStyle;
  if (Array.isArray(propsStyle)) {
    style = getPropsStyleForArray(propsStyle) as CTextStyle;
  }

  const fontFamilyName = style?.fontFamily ?? defaultFontFamily;
  const fontWeight = style?.fontWeight ?? 'normal';
  const fontStyle = style?.fontStyle;
  const target = fontFamilyList.find(item => {
    if (item.fontFamily && item.fontFamily !== fontFamilyName) {
      return false;
    }
    if (item.fontWeightTarget && !item.fontWeightTarget.includes(fontWeight)) {
      return false;
    }
    if (item.langCode && langCode && !item.langCode.includes(langCode)) {
      return false;
    }
    if (
      item.fontStyleTarget &&
      fontStyle &&
      !item.fontStyleTarget.includes(fontStyle)
    ) {
      return false;
    }
    return true;
  });

  return {
    fontSize: style?.fontSize ?? 16,
    fontFamily: target?.fontFamilyRaw ?? fontFamilyName,
    fontWeight: target?.fontWeight ?? fontWeight,
    fontStyle: target?.fontStyle ?? fontStyle,
  };
}

export const fontFamilyList = Platform.select<FontFamilyItem[]>({
  default: [],
  ios: [],
});
