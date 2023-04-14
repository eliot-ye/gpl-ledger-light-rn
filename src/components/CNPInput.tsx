import {Colors} from '@/configs/colors';
import React, {useContext, useMemo, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {CPNIonicons, CPNPageViewThemeColor, CPNText, IONName} from './base';
import {StyleGet} from '@/configs/styles';

const styles = StyleSheet.create({
  inputContainer: {
    ...StyleGet.cellView(),
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {padding: 0, borderWidth: 0, flex: 1},
});

interface CNPInputProps extends TextInputProps {
  label?: string;
  hasError?: boolean;
  errorText?: string;
  focused?: boolean;
  onPressRightIcon?: () => void;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export function CNPInput(props: CNPInputProps) {
  const themeColor = useContext(CPNPageViewThemeColor);

  const [isFocus, isFocusSet] = useState(false);

  const focused =
    props.focused || isFocus || !!props.value || !!props.defaultValue;

  const labelStr = useMemo(() => {
    if (props.label) {
      return props.label;
    }

    if (props.placeholder && focused) {
      return props.placeholder;
    }

    return;
  }, [focused, props.label, props.placeholder]);

  const placeholderStr = useMemo(() => {
    if (props.label) {
      return props.placeholder;
    }

    return isFocus ? '' : props.placeholder;
  }, [isFocus, props.label, props.placeholder]);

  return (
    <View>
      {(!!props.label || !!props.placeholder) && (
        <View style={StyleGet.cellTitleView()}>
          <CPNText
            style={[
              {color: themeColor || Colors.theme},
              props.hasError && {color: Colors.fail},
            ]}>
            {labelStr}
          </CPNText>
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors.backgroundGrey,
            borderBottomColor: Colors.dividingLine,
          },
          focused && {borderBottomColor: themeColor || Colors.theme},
          props.hasError && {borderBottomColor: Colors.fail},
        ]}>
        <TextInput
          pointerEvents={props.editable === false ? 'none' : 'auto'}
          autoCorrect={false}
          allowFontScaling={false}
          autoCapitalize={'none'}
          multiline={!props.secureTextEntry && props.editable === false}
          {...props}
          placeholder={placeholderStr}
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
      {!!props.errorText && (
        <View style={{opacity: props.hasError ? 1 : 0}}>
          <CPNText style={{fontSize: 12, color: Colors.fail}}>
            {props.errorText}
          </CPNText>
        </View>
      )}
    </View>
  );
}
