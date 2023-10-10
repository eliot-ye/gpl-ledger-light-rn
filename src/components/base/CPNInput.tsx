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
import {CPNIonicons, CPNPageViewThemeColor, CPNText, IONName} from '.';
import {StyleGet} from '@/configs/styles';
import {FormItemContext} from './CPNFormItem';
import {I18n} from '@/assets/I18n';

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
  description?: React.ReactNode;
}

export function CPNInput(props: CPNInputProps) {
  I18n.useLocal();

  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor = formItem.themeColor || pageViewThemeColor || Colors.theme;

  const [isFocus, isFocusSet] = useState(false);

  const focused = isFocus || !!props.value || !!props.defaultValue;

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors.backgroundPanel,
            borderBottomWidth: 2,
          },
          focused && {borderColor: themeColor},
          formItem.hasError && {borderColor: Colors.fail},
        ]}>
        <TextInput
          pointerEvents={props.editable === false ? 'none' : 'auto'}
          autoCorrect={false}
          allowFontScaling={false}
          autoCapitalize={'none'}
          multiline={!props.secureTextEntry && props.editable === false}
          placeholder={I18n.f(I18n.t('PlaceholderInput'), formItem.title)}
          placeholderTextColor={Colors.fontPlaceholder}
          {...props}
          style={[styles.input, StyleGet.title('h4'), props.style]}
          onFocus={ev => {
            props.onFocus && props.onFocus(ev);
            isFocusSet(true);
          }}
          onBlur={ev => {
            props.onBlur && props.onBlur(ev);
            isFocusSet(false);
          }}
        />
        {props.onPressRightIcon && (
          <TouchableOpacity
            accessibilityRole="togglebutton"
            onPress={props.onPressRightIcon}>
            {props.rightIcon || (
              <CPNIonicons
                name={props.secureTextEntry ? IONName.Eye : IONName.EyeOff}
                style={{color: Colors.fontText}}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {!!props.description &&
        !formItem.hasError &&
        (['number', 'string'].includes(typeof props.description) ? (
          <CPNText style={{fontSize: 12, opacity: 0.6}}>
            {props.description}
          </CPNText>
        ) : (
          props.description
        ))}
    </View>
  );
}
