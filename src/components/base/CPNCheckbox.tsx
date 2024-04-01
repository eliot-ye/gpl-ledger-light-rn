import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNText} from './CPNText';
import {Colors} from '@/configs/colors';
import {CPNIonicons, IONName} from './CPNIcon';
import {CPNPageViewThemeColor} from './CPNPageView';
import {FormItemContext} from './CPNFormItem';
import {colorGetBackground} from '@/utils/tools';

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
  },
});

interface CPNCheckboxProps {
  label?: React.ReactNode;
  showLabel?: boolean;
  description?: React.ReactNode;
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
export function CPNCheckbox(props: Readonly<CPNCheckboxProps>) {
  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor =
    (formItem.themeColor ?? pageViewThemeColor) || Colors.theme;

  const verticalCentering =
    props.verticalCentering !== false && !props.description;

  const ShowLabel = props.showLabel !== false && !!props.label;
  const label = props.label || formItem.title;

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole={props.isRadio ? 'radio' : 'checkbox'}
      accessibilityLabel={
        typeof props.label === 'string' ? props.label : formItem.title
      }
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
            marginRight: ShowLabel ? 10 : 0,
            borderColor: themeColor,
            backgroundColor: colorGetBackground(themeColor),
          },
          !verticalCentering && {
            marginTop: props.verticalMarginTop ?? 4,
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
      {ShowLabel && (
        <View style={{flex: 1}}>
          {['number', 'string'].includes(typeof label) ? (
            <CPNText>{label}</CPNText>
          ) : (
            label
          )}
          {['number', 'string'].includes(typeof props.description) ? (
            <CPNText style={{fontSize: 12, opacity: 0.6}}>
              {props.description}
            </CPNText>
          ) : (
            props.description
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
