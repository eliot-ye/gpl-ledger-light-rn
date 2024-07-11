import React, {createContext, useContext} from 'react';
import {Linking, Text, TextProps, TextStyle} from 'react-native';
import {Colors} from '@/assets/colors';
import {I18n, LangCode} from '@/assets/I18n';

export const FontColorContext = createContext('');
export const FontSizeContext = createContext(16);

type FontFamilyName = 'Serif';
const defaultFontFamily: FontFamilyName = 'Serif';
const fontFamilyMap: FontFamilyMap = {
  Serif: {
    default: {
      normal: [],
    },
  },
};

interface CTextStyle extends TextStyle {
  fontFamily?: FontFamilyName;
}

interface CPNTextProps extends TextProps {
  link?: string;
  style?: CTextStyle | CTextStyle[];
}
export function CPNText(props: Readonly<CPNTextProps>) {
  const colorDefault = useContext(FontColorContext) || Colors.fontText;

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

type FontFamilyMap = {
  [fontFamilyName in FontFamilyName]?: FontFamilyLangMap;
};
type FontFamilyLangMap = {default: FontFamilyStyleMap} & {
  [langCode in LangCode]?: FontFamilyStyleMap;
};
type FontFamilyStyleMap = {
  normal: FontFamilyWeightItem[];
  italic?: FontFamilyWeightItem[];
};
interface FontFamilyWeightItem {
  fontWeight: TextStyle['fontWeight'][];
  fontFamily: string;
}

function getFontFamily(
  langCode: LangCode,
  propsStyle: CTextStyle | CTextStyle[] | undefined,
): string | undefined {
  let style = propsStyle as CTextStyle;
  if (Array.isArray(propsStyle)) {
    let _style = {};
    for (const el of propsStyle) {
      _style = {..._style, ...el};
    }
    style = _style;
  }

  const fontFamilyName = style?.fontFamily ?? defaultFontFamily;

  const fontFamilyLangMap = fontFamilyMap[fontFamilyName];
  if (!fontFamilyLangMap) {
    return undefined;
  }
  const fontFamilyStyleMap =
    fontFamilyLangMap[langCode] ?? fontFamilyLangMap.default;
  let fontFamilyWeightList = fontFamilyStyleMap.normal;
  if (style?.fontStyle === 'italic' && fontFamilyStyleMap.italic) {
    fontFamilyWeightList = fontFamilyStyleMap.italic;
  }

  return fontFamilyWeightList.find(item =>
    item.fontWeight.includes(style?.fontWeight),
  )?.fontFamily;
}
