import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Animated, ViewProps} from 'react-native';
import {Colors} from '@/assets/colors';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';
import {useDimensions} from '@/utils/useDimensions';

interface CPNLoadingProps extends ViewProps {}

export function createCPNLoading() {
  const ev = createSubscribeEvents<{trigger: 'show' | 'close'}>();

  function CPNLoading(props: Readonly<CPNLoadingProps>) {
    const [loadingCount, setLoadingCount] = useState(0);
    useEffect(() => {
      return ev.subscribe('trigger', type =>
        setLoadingCount(c => {
          if (type === 'show') {
            return c + 1;
          }
          if (type === 'close' && c > 0) {
            return c - 1;
          }
          return c;
        }),
      );
    }, []);

    const [show, setShow] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (loadingCount > 0) {
        setShow(true);
        Animated.timing(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          setShow(false);
        });
      }
    }, [animatedValue, loadingCount]);

    const screenSize = useDimensions('screen');

    return (
      <>
        {show ? (
          <Animated.View
            {...props}
            style={[
              {
                width: screenSize.width,
                height: screenSize.height,
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: Colors.backgroundModal,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: animatedValue,
              },
              props.style,
            ]}>
            <ActivityIndicator size="large" color={Colors.backgroundTheme} />
          </Animated.View>
        ) : null}
      </>
    );
  }

  return {
    Provider: CPNLoading,
    open() {
      ev.publish('trigger', 'show');
    },
    close() {
      ev.publish('trigger', 'close');
    },
  } as const;
}

export const CPNLoading = createCPNLoading();
