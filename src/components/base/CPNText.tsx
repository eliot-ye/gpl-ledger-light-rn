import {CTextStyle, getFontStyles} from '@/assets/fontStyles';
import React, {createContext, useContext} from 'react';
import {Linking, StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {ColorsInstance} from '@/assets/colors';
import {I18n} from '@/assets/I18n';

export const FontColorContext = createContext('');
export const FontSizeContext = createContext(16);

interface CPNTextProps extends TextProps {
  link?: string;
  style?: StyleProp<CTextStyle>;
  children?: any;
  hasDot?: boolean;
  dotStyle?: StyleProp<TextStyle>;
}
export function CPNText(props: Readonly<CPNTextProps>) {
  const dotColor = ColorsInstance.useConstant('warning');
  const fontTextColor = ColorsInstance.useConstant('fontText');
  const colorDefault = useContext(FontColorContext) || fontTextColor;

  const fontSizeDefault = useContext(FontSizeContext);
  const _fontStyles = getFontStyles(
    [{fontSize: fontSizeDefault}, props.style],
    I18n.getLangCode(),
  );

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
        {
          includeFontPadding: false,
          textAlignVertical: 'center',
          color: colorDefault,
        },
        !!props.link && {
          textDecorationLine: 'underline',
        },
        props.style,
        _fontStyles,
      ]}>
      {props.children}
      {props.hasDot && (
        <Text
          style={[
            {fontSize: _fontStyles.fontSize},
            props.style,
            {color: dotColor, fontWeight: 'bold'},
            props.dotStyle,
          ]}>
          .
        </Text>
      )}
    </Text>
  );
}
