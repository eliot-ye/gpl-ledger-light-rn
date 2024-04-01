import {Colors} from '@/configs/colors';
import React, {PropsWithChildren, useEffect, useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Animated, Modal, PanResponder, View} from 'react-native';
import {StyleGet} from '@/configs/styles';
import {CPNActionSheet} from './CPNActionSheet';
import {CPNAlert} from './CPNAlert';
import {CPNLoading} from './CPNLoading';
import {CPNToast} from './CPNToast';
import {useDimensions} from '@/utils/useDimensions';

const Config = {
  offset: 10,
  borderRadius: 10,
} as const;

interface ModalPageProps extends PropsWithChildren {
  show: boolean;
  onClose: () => void;
  /**
   * 是否启用下拉关闭手势，和滚动有冲突。
   * @default false
   * */
  gestureEnabled?: boolean;
}

export function createCPNPageModal() {
  const translateY = new Animated.Value(0);

  return {
    Provider(props: PropsWithChildren) {
      const edgeInsets = useSafeAreaInsets();
      const statusBarHeight = useMemo(
        () => edgeInsets.top || Config.offset,
        [edgeInsets.top],
      );
      const {height: screenHeight, width: screenWidth} =
        useDimensions('screen');
      const boxHeight = useMemo(
        () => screenHeight - statusBarHeight - Config.offset,
        [statusBarHeight, screenHeight],
      );

      useEffect(() => {
        translateY.setValue(boxHeight);
      }, [boxHeight]);

      const borderRadiusAnimatedInterpolation = translateY.interpolate<number>({
        inputRange: [0, boxHeight],
        outputRange: [Config.borderRadius, 0],
        extrapolate: 'clamp',
      });

      return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundBlack}}>
          <Animated.View
            style={[
              {
                flex: 1,
                transform: [
                  {
                    translateY: translateY.interpolate<number>({
                      inputRange: [0, boxHeight],
                      outputRange: [statusBarHeight - Config.offset, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    scale: translateY.interpolate<number>({
                      inputRange: [0, boxHeight],
                      outputRange: [1 - Config.offset / screenWidth, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                borderTopLeftRadius: borderRadiusAnimatedInterpolation,
                borderTopRightRadius: borderRadiusAnimatedInterpolation,
                overflow: 'hidden',
              },
            ]}>
            {props.children}
          </Animated.View>
        </View>
      );
    },

    View(props: ModalPageProps) {
      const edgeInsets = useSafeAreaInsets();
      const statusBarHeight = useMemo(
        () => edgeInsets.top || Config.offset,
        [edgeInsets.top],
      );
      const screenHeight = useDimensions('screen').height;
      const boxHeight = useMemo(
        () => screenHeight - statusBarHeight - Config.offset,
        [statusBarHeight, screenHeight],
      );

      useEffect(() => {
        if (props.show) {
          Animated.timing(translateY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(translateY, {
            toValue: boxHeight,
            useNativeDriver: false,
          }).start();
        }
      }, [boxHeight, props.show]);

      const closeThreshold = boxHeight / 2;

      const panResponderInstance = useMemo(() => {
        async function onTouchMoveEnd(dy: number) {
          if (dy > closeThreshold) {
            props.onClose();
          } else {
            Animated.timing(translateY, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        }

        return PanResponder.create({
          onStartShouldSetPanResponder: () => props.gestureEnabled || false,
          onPanResponderMove: (_ev, ge) => {
            if (ge.dy > 0 && ge.dy < boxHeight) {
              translateY.setValue(ge.dy);
            }
          },
          onPanResponderEnd: (_ev, ge) => {
            // console.log('onPanResponderEnd', ge.dy);
            onTouchMoveEnd(ge.dy);
          },
          onPanResponderTerminate: (_ev, ge) => {
            // console.log('onPanResponderTerminate');
            onTouchMoveEnd(ge.dy);
          },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [boxHeight, props.gestureEnabled]);

      return (
        <Modal
          transparent
          statusBarTranslucent
          animationType="slide"
          visible={props.show}
          onRequestClose={props.onClose}>
          <Animated.View
            style={{
              flex: 1,
              paddingTop: statusBarHeight + Config.offset,
              backgroundColor: translateY.interpolate({
                inputRange: [-60, closeThreshold],
                outputRange: [Colors.backgroundModal, Colors.transparent],
                extrapolate: 'clamp',
              }),
            }}
            {...panResponderInstance.panHandlers}>
            <Animated.View
              style={[
                StyleGet.boxShadow(),
                {
                  height: boxHeight,
                  transform: [{translateY: translateY}],
                  backgroundColor: Colors.backgroundTheme,
                  borderTopLeftRadius: Config.borderRadius,
                  borderTopRightRadius: Config.borderRadius,
                  overflow: 'hidden',
                },
              ]}>
              {props.children}
            </Animated.View>
          </Animated.View>
          <CPNActionSheet.Provider />
          <CPNAlert.Provider />
          <CPNToast.Provider />
          <CPNLoading.Provider />
        </Modal>
      );
    },
  } as const;
}

export const CPNPageModal = createCPNPageModal();
