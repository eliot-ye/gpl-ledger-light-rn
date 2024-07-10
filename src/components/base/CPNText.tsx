import React, {createContext, useContext} from 'react';
import {Linking, Text, TextProps} from 'react-native';
import {Colors} from '@/assets/colors';

export const FontColorContext = createContext('');
export const FontSizeContext = createContext(16);

interface CPNTextProps extends TextProps {
  link?: string;
}
export function CPNText(props: Readonly<CPNTextProps>) {
  const colorDefault = useContext(FontColorContext) || Colors.fontText;

  const fontSizeDefault = useContext(FontSizeContext);

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
