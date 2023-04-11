import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Animated, useWindowDimensions} from 'react-native';
import {Colors} from '@/configs/colors';
import {CreateEvents} from '@/libs/CreateEvents';

export function createCPNLoading() {
  const ev = CreateEvents<'show' | 'close'>();

  function CPNLoading() {
    const [loadingCount, setLoadingCount] = useState(0);
    useEffect(() => {
      const id = ev.subscribe(type =>
        setLoadingCount(c => {
          if (type === 'show') {
            return c + 1;
          }
          if (type === 'close') {
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
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          showSet(false);
        });
      }
    }, [animatedValue, loadingCount]);

    const windowSize = useWindowDimensions();

    return (
      <>
        {show ? (
          <Animated.View
            style={{
              width: windowSize.width,
              height: windowSize.height,
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
