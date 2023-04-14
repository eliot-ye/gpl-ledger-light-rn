import React, {createContext, useContext} from 'react';
import {Linking, Text, TextProps} from 'react-native';
import {Colors} from '@/configs/colors';

export const CPNTextColorContext = createContext('');
export const CPNTextFontSizeContext = createContext(16);

interface CPNTextProps extends TextProps {
  link?: string;
}
export function CPNText(props: CPNTextProps) {
  const colorDefault = useContext(CPNTextColorContext) || Colors.fontText;

  const fontSizeDefault = useContext(CPNTextFontSizeContext);

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
      ]}>
      {props.children}
    </Text>
  );
}
