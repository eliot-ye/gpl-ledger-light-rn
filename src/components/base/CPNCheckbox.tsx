import React, {useContext, type PropsWithChildren} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNText} from './CPNText';
import {Colors} from '@/configs/colors';
import {CPNIonicons, IONName} from './CPNIcon';
import {CPNPageViewThemeColor} from './CPNPageView';
import {FormItemContext} from './CPNFormItem';

const Config = {
  size: 20,
  borderRadius: 4,
  borderWidth: 1,
} as const;

const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
  iconWrapper: {
    width: Config.size,
    height: Config.size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Config.borderRadius,
    borderWidth: Config.borderWidth,
    marginRight: 10,
  },
});

interface CPNCheckboxProps extends PropsWithChildren {
  label?: string;
  checked: boolean;
  onPress?: () => void;
  isRadio?: boolean;
  disabled?: boolean;
  /**
   * 是否垂直居中
   * @default true
   * */
  verticalCentering?: boolean;
  /**
   * 垂直偏移量，当 `verticalCentering = false` 时生效
   * @default 8
   * */
  verticalMarginTop?: number;
}
export function CPNCheckbox(props: CPNCheckboxProps) {
  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor = formItem.themeColor || pageViewThemeColor || Colors.theme;

  const verticalCentering = props.verticalCentering !== false;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole={props.isRadio ? 'radio' : 'checkbox'}
      accessibilityLabel={props.label}
      accessibilityState={{
        disabled: props.disabled,
        checked: props.checked,
      }}
      disabled={props.disabled}
      style={[
        styles.container,
        {
          alignItems: verticalCentering ? 'center' : 'flex-start',
          marginRight: formItem.isFormItem ? 16 : 0,
        },
      ]}
      onPress={props.onPress}>
      <View
        style={[
          styles.iconWrapper,
          {
            borderColor: themeColor,
            backgroundColor: Colors.backgroundTheme,
          },
          !verticalCentering && {
            marginTop:
              props.verticalMarginTop === undefined
                ? 4
                : props.verticalMarginTop,
          },
          props.isRadio && {borderRadius: Config.size * 0.5},
          props.checked && !props.isRadio && {backgroundColor: themeColor},
          formItem.hasError && {borderColor: Colors.fail},
          props.disabled && {
            backgroundColor: Colors.backgroundDisabled,
            borderColor: Colors.backgroundDisabled,
          },
        ]}>
        {props.checked &&
          (props.isRadio ? (
            <View
              style={{
                width: Config.size / 2,
                height: Config.size / 2,
                borderRadius: Config.size / 4,
                backgroundColor: themeColor,
              }}
            />
          ) : (
            <CPNIonicons
              name={IONName.Checkmark}
              color={Colors.fontTitleReverse}
              size={Config.size - 4}
            />
          ))}
      </View>
      <View>{props.children || <CPNText>{props.label}</CPNText>}</View>
    </TouchableOpacity>
  );
}
