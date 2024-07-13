import {Colors, ColorsInstance} from '@/assets/colors';
import {StyleGet} from '@/assets/styles';
import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, PanResponder} from 'react-native';
import {CPNIonicons, IONName} from '.';

const cellView = StyleGet.cellView();
const Config = {
  borderWidth: 2,
  height: cellView.minHeight - cellView.paddingVertical * 2 - 6,
} as const;

interface CPNSwitchProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  thumbColor?: string;
  backgroundColor?: string;
  activeBackgroundColor?: string;
}
export function CPNSwitch(props: Readonly<CPNSwitchProps>) {
  ColorsInstance.useCode();

  const thumbColor = props.thumbColor ?? Colors.backgroundPanel;
  const backgroundColor = props.backgroundColor ?? Colors.fontPlaceholder;
  const activeBackgroundColor = props.activeBackgroundColor ?? Colors.theme;

  const width = (Config.height / 3) * 5;
  const thumbSize = Config.height - Config.borderWidth * 2;
  const thumbTranslateToValue = width - Config.borderWidth * 2 - thumbSize;
  const thumbTranslateAnimated = useRef(
    new Animated.Value(props.value ? thumbTranslateToValue : 0),
  ).current;

  useEffect(() => {
    Animated.spring(thumbTranslateAnimated, {
      toValue: props.value ? thumbTranslateToValue : 0,
      useNativeDriver: false,
    }).start();
  }, [props.value, thumbTranslateAnimated, thumbTranslateToValue]);

  const thumbSizeToValue = (thumbSize / 4) * 5;
  const thumbTranslateOnPassToValue =
    width - Config.borderWidth * 2 - thumbSizeToValue;

  const bgColor = thumbTranslateAnimated.interpolate({
    inputRange: [0, thumbTranslateOnPassToValue, width - thumbSize],
    outputRange: [
      backgroundColor,
      activeBackgroundColor,
      activeBackgroundColor,
    ],
  });

  const thumbSizeAnimated = useRef(new Animated.Value(thumbSize)).current;

  const panResponder = useMemo(() => {
    function onTouchEnd(isSuccess: boolean) {
      Animated.spring(thumbSizeAnimated, {
        toValue: thumbSize,
        useNativeDriver: false,
      }).start();
      if (!isSuccess && props.value) {
        Animated.spring(thumbTranslateAnimated, {
          toValue: thumbTranslateToValue,
          useNativeDriver: false,
        }).start();
      }
      if (isSuccess && props.onChange) {
        props.onChange(!props.value);
      }
    }

    return PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: () => !props.disabled,
      onStartShouldSetPanResponderCapture: () => !props.disabled,
      onMoveShouldSetPanResponder: () => !props.disabled,
      onMoveShouldSetPanResponderCapture: () => !props.disabled,

      onPanResponderGrant: () => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        Animated.spring(thumbSizeAnimated, {
          toValue: thumbSizeToValue,
          useNativeDriver: false,
        }).start();
        if (props.value) {
          Animated.spring(thumbTranslateAnimated, {
            toValue: thumbTranslateOnPassToValue,
            useNativeDriver: false,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
        onTouchEnd(true);
      },
      onPanResponderTerminate: () => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
        onTouchEnd(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.value,
    props.disabled,
    thumbSize,
    thumbTranslateToValue,
    thumbTranslateOnPassToValue,
  ]);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      accessibilityRole={'switch'}
      accessibilityState={{checked: props.value}}
      style={{
        backgroundColor: bgColor,
        borderColor: bgColor,
        borderWidth: Config.borderWidth,
        borderRadius: Config.height / 2,
        height: Config.height,
        width,
        opacity: props.disabled ? 0.5 : 1,
      }}>
      <Animated.View
        style={[
          StyleGet.boxShadow(),
          {
            height: thumbSize,
            width: thumbSizeAnimated,
            borderRadius: thumbSize / 2,
            backgroundColor: props.disabled
              ? Colors.backgroundDisabled
              : thumbColor,
            transform: [{translateX: thumbTranslateAnimated}],
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <CPNIonicons
          name={props.value ? IONName.RemoveOutline : IONName.EllipseOutline}
          size={10}
          color={Colors.fontTitle}
        />
      </Animated.View>
    </Animated.View>
  );
}
