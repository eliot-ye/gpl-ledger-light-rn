import React, {createContext, useContext, useMemo} from 'react';
import {Linking, Text, TextProps} from 'react-native';
import {Colors} from '@/configs/colors';

export const CPNTextColorContext = createContext('');

interface CPNTextProps extends TextProps {
  link?: string;
}
export function CPNText(props: CPNTextProps) {
  const btnColor = useContext(CPNTextColorContext);
  const textColor = useMemo(() => {
    return btnColor || Colors.fontText;
  }, [btnColor]);

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
        {color: textColor},
        !!props.link && {
          textDecorationLine: 'underline',
        },
        props.style,
      ]}>
      {props.children}
    </Text>
  );
}
