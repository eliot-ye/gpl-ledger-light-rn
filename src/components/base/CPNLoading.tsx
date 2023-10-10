import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Animated} from 'react-native';
import {Colors} from '@/configs/colors';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';
import {useDimensions} from '@/utils/useDimensions';

export function createCPNLoading() {
  const ev = createSubscribeEvents<'show' | 'close'>();

  function CPNLoading() {
    const [loadingCount, setLoadingCount] = useState(0);
    useEffect(() => {
      const id = ev.subscribe(type =>
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
      return () => ev.unsubscribe(id);
    }, []);

    const [show, showSet] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (loadingCount > 0) {
        showSet(true);
        Animated.timing(animatedValue, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: false,
        }).start(() => {
          showSet(false);
        });
      }
    }, [animatedValue, loadingCount]);

    const screenSize = useDimensions('screen');

    return (
      <>
        {show ? (
          <Animated.View
            style={{
              width: screenSize.width,
              height: screenSize.height,
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: Colors.backgroundModal,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: animatedValue,
            }}>
            <ActivityIndicator size="large" color={Colors.backgroundTheme} />
          </Animated.View>
        ) : null}
      </>
    );
  }

  return {
    Provider: CPNLoading,
    open() {
      ev.publish('show');
    },
    close() {
      ev.publish('close');
    },
  } as const;
}

export const CPNLoading = createCPNLoading();
