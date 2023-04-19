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
  shape?: 'round';
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
  const themeColor = useContext(CPNPageViewThemeColor);
  const formData = useContext(FormItemContext);

  const verticalCentering = props.verticalCentering !== false;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="checkbox"
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
          marginRight: formData.isFormItem ? 16 : 0,
        },
      ]}
      onPress={props.onPress}>
      <View
        style={[
          styles.iconWrapper,
          {
            borderColor: themeColor || Colors.theme,
            backgroundColor: Colors.backgroundTheme,
          },
          !verticalCentering && {
            marginTop:
              props.verticalMarginTop === undefined
                ? 8
                : props.verticalMarginTop,
          },
          props.shape === 'round' && {borderRadius: Config.size * 0.5},
          props.checked && {backgroundColor: themeColor || Colors.theme},
          formData.hasError && {borderColor: Colors.fail},
          props.disabled && {
            backgroundColor: Colors.backgroundDisabled,
            borderColor: Colors.backgroundDisabled,
          },
        ]}>
        {props.checked && (
          <CPNIonicons
            name={IONName.Checkmark}
            color={Colors.fontTitleReverse}
            size={Config.size - 4}
          />
        )}
      </View>
      <View>{props.children || <CPNText>{props.label}</CPNText>}</View>
    </TouchableOpacity>
  );
}
