import React, {createContext, useContext} from 'react';
import {Linking, StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {ColorsInstance} from '@/assets/colors';
import {I18n, LangCode} from '@/assets/I18n';

export const FontColorContext = createContext('');
export const FontSizeContext = createContext(16);

type FontFamilyName = 'Serif';
const defaultFontFamily: FontFamilyName = 'Serif';
const fontFamilyList: FontFamilyItem[] = [
  {
    fontFamily: 'Serif',
    fontWeight: ['normal', '400'],
    fontFamilyRaw: 'Serif',
  },
];

export interface CTextStyle extends TextStyle {
  fontFamily?: FontFamilyName;
}

interface CPNTextProps extends TextProps {
  link?: string;
  style?: StyleProp<CTextStyle>;
}
export function CPNText(props: Readonly<CPNTextProps>) {
  const fontTextColor = ColorsInstance.useConstant('fontText');
  const colorDefault = useContext(FontColorContext) || fontTextColor;

  const fontSizeDefault = useContext(FontSizeContext);

  const langCode = I18n.useLangCode();
  const fontFamily = getFontFamily(langCode, props.style);

  return (
    <Text
      accessibilityRole={props.link ? 'link' : 'text'}
      onPress={
        props.link
          ? () => {
              if (props.link) {
                Linking.openURL(props.link);
              }
            }
          : undefined
      }
      {...props}
      style={[
        {color: colorDefault, fontSize: fontSizeDefault},
        !!props.link && {
          textDecorationLine: 'underline',
        },
        props.style,
        !!fontFamily && {fontFamily},
      ]}>
      {props.children}
    </Text>
  );
}

interface FontFamilyItem {
  fontFamily: FontFamilyName;
  fontWeight: CTextStyle['fontWeight'][];
  fontStyle?: CTextStyle['fontStyle'];
  fontFamilyRaw: string;
  langCode?: LangCode[];
}

function getFontFamily(langCode: LangCode, propsStyle: StyleProp<CTextStyle>) {
  let style = propsStyle as CTextStyle;
  if (Array.isArray(propsStyle)) {
    let _style = {};
    for (const el of propsStyle) {
      if (typeof el === 'object') {
        _style = {..._style, ...el};
      }
    }
    style = _style;
  }

  const fontFamilyName = style?.fontFamily ?? defaultFontFamily;
  const fontWeight = style?.fontWeight ?? 'normal';
  const fontStyle = style?.fontStyle;
  return fontFamilyList.find(item => {
    if (item.fontFamily !== fontFamilyName) {
      return false;
    }
    if (!item.fontWeight.includes(fontWeight)) {
      return false;
    }
    if (item.langCode && !item.langCode.includes(langCode)) {
      return false;
    }
    if (item.fontStyle && fontStyle !== item.fontStyle) {
      return false;
    }
    return true;
  })?.fontFamilyRaw;
}
