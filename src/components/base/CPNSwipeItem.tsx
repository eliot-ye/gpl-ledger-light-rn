import {Colors} from '@/configs/colors';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {CPNText} from './CPNText';

const Config = {
  radiusDefault: 10,
  buttonDefault: 72,
  buttonPadding: 8,
} as const;

/**
 * - 如果返回 `true` 将触发删除动画，动画时间为 500ms
 * - 如果返回 Callback 将触发删除动画，动画时间为 500ms，并在动画结束后调用 Callback
 * */
type SwipeItemEvent = () =>
  | Promise<(() => void) | boolean | void>
  | boolean
  | void
  | (() => void);
interface CPNSwipeButton {
  text: React.ReactNode;
  /**
   * - 如果返回 `true` 将触发删除动画，动画时间为 500ms
   * - 如果返回 Callback 将触发删除动画，动画时间为 500ms，并在动画结束后调用 Callback
   * */
  onPress?: SwipeItemEvent;
  backgroundColor?: string;
  textColor?: string;
  /** @default 72 */
  width?: number;
}

interface CPNSwipeItemProps extends ViewProps {
  /** ___use memoized value___ */
  leftButtons?: CPNSwipeButton[];
  /** ___use memoized value___ */
  rightButtons?: CPNSwipeButton[];
  /** @default 0 */
  buttonSpacing?: number;
  /** @default 10 */
  radius?: number;
  containerStyle?: ViewStyle;
  /** 左侧滑动触发距离，默认为宽度的一半 */
  leftTriggerDistance?: number;
  /**
   * - 如果返回 `true` 将触发删除动画，动画时间为 500ms
   * - 如果返回 Callback 将触发删除动画，动画时间为 500ms，并在动画结束后调用 Callback
   * */
  onLeftTrigger?: SwipeItemEvent;
  /** 右侧滑动触发距离，默认为宽度的一半 */
  rightTriggerDistance?: number;
  /**
   * - 如果返回 `true` 将触发删除动画，动画时间为 500ms
   * - 如果返回 Callback 将触发删除动画，动画时间为 500ms，并在动画结束后调用 Callback
   * */
  onRightTrigger?: SwipeItemEvent;
}
export function CPNSwipeItem(props: Readonly<CPNSwipeItemProps>) {
  const radius = props.radius ?? Config.radiusDefault;
  const buttonSpacing = props.buttonSpacing ?? 0;

  const [width, setWidth] = useState(Dimensions.get('window').width);
  const leftTriggerDistance = props.leftTriggerDistance ?? width / 2;
  const rightTriggerDistance = props.rightTriggerDistance ?? width / 2;

  const {leftButtons, leftSwipeWidth} = useMemo(() => {
    let _swipeWidth = 0;
    const _leftButtons = props.leftButtons?.map((item, index) => {
      const _width = item.width ?? Config.buttonDefault;
      _swipeWidth += _width + buttonSpacing;
      return {
        id: index,
        width: _width,
        backgroundColor: Colors.theme,
        ...item,
      };
    });
    return {leftButtons: _leftButtons ?? [], leftSwipeWidth: _swipeWidth};
  }, [buttonSpacing, props.leftButtons]);
  const {rightButtons, rightSwipeWidth} = useMemo(() => {
    let _swipeWidth = 0;
    const _buttons = props.rightButtons?.map((item, index) => {
      const _width = item.width ?? Config.buttonDefault;
      _swipeWidth += _width + buttonSpacing;
      return {
        id: index,
        width: _width,
        backgroundColor: Colors.theme,
        ...item,
      };
    });
    return {rightButtons: _buttons ?? [], rightSwipeWidth: _swipeWidth};
  }, [buttonSpacing, props.rightButtons]);

  function renderButton(item: CPNSwipeButton & {id: number}) {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          {
            minWidth: item.width,
            flex: 1,
            backgroundColor: item.backgroundColor,
            marginLeft: buttonSpacing,
            justifyContent: 'center',
            alignItems: 'center',
            padding: Config.buttonPadding,
          },
        ]}
        onPress={async () => {
          try {
            if (item.onPress) {
              const isDelete = await item.onPress();
              onDelete(isDelete);
            }
          } catch (error) {
            console.error('CPNSwipeItem buttons:', error);
          }
        }}>
        {['number', 'string'].includes(typeof item.text) ? (
          <CPNText style={{color: item.textColor}}>{item.text}</CPNText>
        ) : (
          item.text
        )}
      </TouchableOpacity>
    );
  }

  const [deleting, setDeleting] = useState(false);

  const translateXStartRef = useRef(0);
  const translateXRef = useRef(0);
  const translateXAnimated = useRef(new Animated.Value(0)).current;

  const onDelete = useCallback(
    (isDelete: boolean | void | (() => void)) => {
      setDeleting(true);
      const deleteSwipe =
        translateXRef.current < 0
          ? -Dimensions.get('screen').width
          : Dimensions.get('screen').width;
      if (isDelete === true || typeof isDelete === 'function') {
        translateXRef.current = deleteSwipe;
      }
      if (typeof isDelete === 'function') {
        translateXAnimated.addListener(ev => {
          if (ev.value === deleteSwipe) {
            isDelete();
          }
        });
      }
      Animated.timing(translateXAnimated, {
        toValue: translateXRef.current,
        useNativeDriver: false,
      }).start();
    },
    [translateXAnimated],
  );

  const panResponderInstance = useMemo(() => {
    async function onTouchMoveEnd(dx: number) {
      const _translateX = translateXStartRef.current + dx;

      if (leftButtons.length && !isNaN(leftSwipeWidth) && _translateX >= 0) {
        try {
          if (
            Math.abs(_translateX) >= leftTriggerDistance &&
            props.onLeftTrigger
          ) {
            onDelete(await props.onLeftTrigger());
            return;
          }
        } catch (error) {
          console.error('CPNSwipeItem onLeftTrigger:', error);
        }
        if (dx > 0 && Math.abs(_translateX) > leftSwipeWidth / 2) {
          translateXRef.current = leftSwipeWidth;
        } else {
          translateXRef.current = 0;
        }
      } else if (
        rightButtons.length &&
        !isNaN(rightSwipeWidth) &&
        _translateX <= 0
      ) {
        try {
          if (
            Math.abs(_translateX) >= rightTriggerDistance &&
            props.onRightTrigger
          ) {
            onDelete(await props.onRightTrigger());
            return;
          }
        } catch (error) {
          console.error('CPNSwipeItem onRightTrigger:', error);
        }
        if (dx < 0 && Math.abs(_translateX) > rightSwipeWidth / 2) {
          translateXRef.current = -rightSwipeWidth;
        } else {
          translateXRef.current = 0;
        }
      } else {
        translateXRef.current = 0;
      }

      Animated.spring(translateXAnimated, {
        toValue: translateXRef.current,
        useNativeDriver: false,
      }).start();
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () =>
        !!leftButtons.length || !!rightButtons.length,
      onMoveShouldSetPanResponder: (_ev, ge) => {
        if (Math.abs(ge.dx) > 5) {
          return !!leftButtons.length || !!rightButtons.length;
        }
        return false;
      },
      onPanResponderGrant: () => {
        // console.log('onPanResponderGrant');

        translateXStartRef.current = translateXRef.current;
      },
      onPanResponderMove: (_ev, ge) => {
        // console.log('onPanResponderMove', translateXRef.current, ge.dx);

        const _translateX = translateXStartRef.current + ge.dx;
        if (leftButtons.length && _translateX >= 0) {
          translateXRef.current = _translateX;
          translateXAnimated.setValue(translateXRef.current);
        }
        if (rightButtons.length && _translateX <= 0) {
          translateXRef.current = _translateX;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    leftButtons.length,
    leftSwipeWidth,
    rightButtons.length,
    rightSwipeWidth,
    translateXAnimated,
    leftTriggerDistance,
    onDelete,
    rightTriggerDistance,
  ]);

  useEffect(() => {
    return () => {
      translateXAnimated.removeAllListeners();
    };
  }, [translateXAnimated]);

  return (
    <View
      style={props.containerStyle}
      onLayout={ev => {
        setWidth(ev.nativeEvent.layout.width);
      }}>
      <View
        style={{
          width: width,
          borderRadius: radius,
          overflow: 'hidden',
          flexDirection: 'row',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
        {!deleting && (
          <Animated.View
            style={[
              {
                flexDirection: 'row',
                transform: [{translateX: translateXAnimated}],
                position: 'absolute',
                right: width,
                top: 0,
                bottom: 0,
                width: translateXAnimated.interpolate({
                  inputRange: [0, leftSwipeWidth, width],
                  outputRange: [leftSwipeWidth, leftSwipeWidth, width],
                }),
              },
            ]}>
            {leftButtons.map(item => renderButton(item))}
          </Animated.View>
        )}
        <Animated.View
          style={{width: width, transform: [{translateX: translateXAnimated}]}}
        />
        {!deleting && (
          <Animated.View
            style={[
              {
                flexDirection: 'row-reverse',
                transform: [{translateX: translateXAnimated}],
                position: 'absolute',
                left: width,
                top: 0,
                bottom: 0,
                width: translateXAnimated.interpolate({
                  inputRange: [-width, -rightSwipeWidth, 0],
                  outputRange: [width, rightSwipeWidth, rightSwipeWidth],
                }),
              },
            ]}>
            {rightButtons.map(item => renderButton(item))}
          </Animated.View>
        )}
      </View>
      <Animated.View
        {...props}
        style={[
          props.style,
          {
            transform: [{translateX: translateXAnimated}],
          },
        ]}
        {...panResponderInstance.panHandlers}>
        {props.children}
      </Animated.View>
    </View>
  );
}
