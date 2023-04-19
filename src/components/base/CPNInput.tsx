import {Colors} from '@/configs/colors';
import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {CPNIonicons, CPNPageViewThemeColor, IONName} from '.';
import {StyleGet} from '@/configs/styles';
import {FormItemContext} from './CPNFormItem';

const styles = StyleSheet.create({
  inputContainer: {
    ...StyleGet.cellView(),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {padding: 0, borderWidth: 0, flex: 1},
});

interface CPNInputProps extends TextInputProps {
  onPressRightIcon?: () => void;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function CPNInput(props: CPNInputProps) {
  const themeColor = useContext(CPNPageViewThemeColor);
  const formItem = useContext(FormItemContext);

  const [isFocus, isFocusSet] = useState(false);

  const focused = isFocus || !!props.value || !!props.defaultValue;

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: Colors.backgroundPanel,
          borderBottomColor: Colors.line,
        },
        focused && {borderBottomColor: themeColor || Colors.theme},
        formItem.hasError && {borderBottomColor: Colors.fail},
      ]}>
      <TextInput
        pointerEvents={props.editable === false ? 'none' : 'auto'}
        autoCorrect={false}
        allowFontScaling={false}
        autoCapitalize={'none'}
        multiline={!props.secureTextEntry && props.editable === false}
        placeholderTextColor={Colors.fontPlaceholder}
        {...props}
        style={[styles.input, StyleGet.title('h4'), props.style]}
        onFocus={() => isFocusSet(true)}
        onBlur={() => isFocusSet(false)}
      />
      {props.onPressRightIcon && (
        <TouchableOpacity onPress={props.onPressRightIcon}>
          {props.rightIcon || (
            <CPNIonicons
              name={props.secureTextEntry ? IONName.Eye : IONName.EyeOff}
              style={{color: Colors.fontText}}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
