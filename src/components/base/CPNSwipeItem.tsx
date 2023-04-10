import React, {useMemo, useRef} from 'react';
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {Colors} from '@/configs/colors';
import {CPNText} from './CPNText';

const Config = {
  radiusDefault: 10,
  buttonDefault: 72,
  buttonPadding: 8,
} as const;

interface CPNSwipeButton {
  text: string;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  /** @default 72 */
  width?: number;
}

interface CPNSwipeItemProps extends ViewProps {
  /** ___use memoized value___ */
  buttons: CPNSwipeButton[];
  /** @default 0 */
  buttonSpacing?: number;
  /** @default 10 */
  radius?: number;
  backgroundColor?: string;
}
export function CPNSwipeItem(props: CPNSwipeItemProps) {
  const radius = props.radius || Config.radiusDefault;
  const buttonSpacing = props.buttonSpacing || 0;

  const {buttons, swipeWidth} = useMemo(() => {
    let _swipeWidth = 0;
    const _buttons = props.buttons.map((item, index) => {
      const _width = item.width || Config.buttonDefault;
      _swipeWidth += _width + buttonSpacing;
      return {
        id: index,
        width: _width,
        backgroundColor: Colors.theme,
        ...item,
      };
    });
    return {buttons: _buttons, swipeWidth: _swipeWidth + 2};
  }, [buttonSpacing, props.buttons]);

  const translateXStartRef = useRef(0);
  const translateXRef = useRef(0);
  const translateXAnimated = useRef(new Animated.Value(0)).current;
  const panResponderInstance = useMemo(() => {
    function onTouchMoveEnd(dx: number) {
      if (dx < 0 && Math.abs(translateXRef.current) > swipeWidth / 2) {
        translateXRef.current = -swipeWidth;
      } else {
        translateXRef.current = 0;
      }

      Animated.timing(translateXAnimated, {
        toValue: translateXRef.current,
        useNativeDriver: true,
      }).start();
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => !!buttons.length,
      onMoveShouldSetPanResponder: (_ev, ge) => {
        if (Math.abs(ge.dx) > 5) {
          return !!buttons.length;
        }
        return false;
      },
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');

        translateXStartRef.current = translateXRef.current;
      },
      onPanResponderMove: (_ev, ge) => {
        // console.log('onPanResponderMove', translateXRef.current, ge.dx);

        const dx = ge.dx + translateXStartRef.current;
        if (dx <= 0 && Math.abs(dx) <= swipeWidth) {
          translateXRef.current = dx;
          translateXAnimated.setValue(translateXRef.current);
        }
      },
      onPanResponderEnd: (_ev, ge) => {
        // console.log('onPanResponderEnd', ge.dx);
        onTouchMoveEnd(ge.dx);
      },
      onPanResponderTerminate: (_ev, ge) => {
        // console.log('onPanResponderTerminate', ge.dx);
        onTouchMoveEnd(ge.dx);
      },
    });
  }, [buttons.length, swipeWidth, translateXAnimated]);

  const containerStyle: ViewStyle = {
    backgroundColor: props.backgroundColor || Colors.backgroundTheme,
    borderRadius: radius,
  };

  return (
    <View style={containerStyle}>
      <View
        style={{
          position: 'absolute',
          right: 1,
          top: 1,
          bottom: 1,
          flexDirection: 'row-reverse',
        }}>
        {buttons.map((item, index) => {
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                {
                  width: item.width,
                  backgroundColor: item.backgroundColor,
                  marginLeft: buttonSpacing,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: Config.buttonPadding,
                },
                index === 0 && {
                  borderBottomEndRadius: radius,
                  borderTopEndRadius: radius,
                },
              ]}
              onPress={() => {
                translateXRef.current = 0;
                // translateXAnimated.setValue(translateXRef.current);
                Animated.timing(translateXAnimated, {
                  toValue: translateXRef.current,
                  useNativeDriver: true,
                }).start();
                item.onPress && item.onPress();
              }}>
              <CPNText style={{color: item.textColor}}>{item.text}</CPNText>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        {...props}
        style={[
          props.style,
          containerStyle,
          {
            overflow: 'hidden',
            transform: [{translateX: translateXAnimated}],
          },
        ]}
        {...panResponderInstance.panHandlers}>
        {props.children}
      </Animated.View>
    </View>
  );
}
