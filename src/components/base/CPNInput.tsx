import {Colors} from '@/assets/colors';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {
  CPNIonicons,
  CPNPageViewContentOffsetYCtx,
  CPNPageViewScrollViewCtx,
  CPNPageViewThemeColor,
  CPNText,
  IONName,
} from '.';
import {StyleGet} from '@/assets/styles';
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
  clearButton?: boolean;
}

export function CPNInput(props: Readonly<CPNInputProps>) {
  I18n.useLangCode();

  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor =
    (formItem.themeColor ?? pageViewThemeColor) || Colors.theme;

  const [isFocus, setIsFocus] = useState(false);

  const focused = isFocus || !!props.value || !!props.defaultValue;

  const ref = useRef<View>(null);
  const CPNPageViewScrollView = useContext(CPNPageViewScrollViewCtx);
  const CPNPageViewontentOffsetY = useContext(CPNPageViewContentOffsetYCtx);
  const windowSize = useWindowDimensions();
  useEffect(() => {
    if (!isFocus) {
      return;
    }
    const emitter = Keyboard.addListener('keyboardDidShow', ev => {
      const KeyboardHeight = ev.endCoordinates.height;
      ref.current?.measure((x, y, width, height, pageX, pageY) => {
        const positionY = windowSize.height - pageY - height - KeyboardHeight;
        if (positionY < 0) {
          CPNPageViewScrollView?.scrollTo({
            y: CPNPageViewontentOffsetY - positionY,
          });
        }
      });
    });
    return () => {
      emitter.remove();
    };
  }, [
    isFocus,
    windowSize.height,
    CPNPageViewontentOffsetY,
    CPNPageViewScrollView,
  ]);

  return (
    <View style={[props.containerStyle]} ref={ref}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors.backgroundPanel,
            borderBottomWidth: 2,
          },
          focused && {borderColor: themeColor},
          formItem.hasError && {borderColor: Colors.fail},
          props.editable === false && {
            backgroundColor: Colors.backgroundDisabled,
          },
        ]}>
        <TextInput
          pointerEvents={props.editable === false ? 'none' : 'auto'}
          blurOnSubmit
          autoCorrect={false}
          allowFontScaling={false}
          autoCapitalize={'none'}
          autoComplete="off"
          multiline={!props.secureTextEntry && props.editable === false}
          placeholder={I18n.f(I18n.t('PlaceholderInput'), formItem.title)}
          placeholderTextColor={Colors.fontPlaceholder}
          {...props}
          clearButtonMode="never"
          style={[styles.input, StyleGet.title('h4'), props.style]}
          onFocus={ev => {
            props.onFocus && props.onFocus(ev);
            setIsFocus(true);
          }}
          onBlur={ev => {
            props.onBlur && props.onBlur(ev);
            setIsFocus(false);
          }}
        />
        {props.clearButton !== false &&
          props.editable !== false &&
          !!props.value && (
            <TouchableOpacity
              onPress={() => {
                props.onChangeText && props.onChangeText('');
              }}>
              <CPNIonicons
                name={IONName.CloseCircle}
                size={16}
                style={{color: themeColor}}
              />
            </TouchableOpacity>
          )}
        {props.onPressRightIcon && (
          <TouchableOpacity
            accessibilityRole="togglebutton"
            style={{marginLeft: 6}}
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
