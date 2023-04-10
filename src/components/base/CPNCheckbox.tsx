import React, {type PropsWithChildren} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNText} from './CPNText';
import {Colors} from '@/configs/colors';
import {CPNIonicons, IONName} from './CPNIcon';

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
        {alignItems: verticalCentering ? 'center' : 'flex-start'},
      ]}
      onPress={props.onPress}>
      <View
        style={[
          styles.iconWrapper,
          {borderColor: Colors.theme, backgroundColor: Colors.backgroundTheme},
          !verticalCentering && {
            marginTop:
              props.verticalMarginTop === undefined
                ? 8
                : props.verticalMarginTop,
          },
          props.shape === 'round' && {borderRadius: Config.size * 0.5},
          props.checked && {backgroundColor: Colors.theme},
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
      <View style={{flex: 1}}>
        {props.children || <CPNText>{props.label}</CPNText>}
      </View>
    </TouchableOpacity>
  );
}
