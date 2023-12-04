import React, {useEffect, useMemo, useState} from 'react';
import {Animated, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Colors} from '@/configs/colors';
import {StyleGet} from '@/configs/styles';
import {getOnlyStr} from '@/utils/tools';
import {CPNText} from './CPNText';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';

const Config = {
  borderRadius: 30,
  fontSize: 12,
} as const;

const styles = StyleSheet.create({
  container: {
    ...StyleGet.boxShadow(),
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: Config.borderRadius,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: Config.fontSize,
    textAlign: 'center',
  },
});

interface ToastOption {
  /**
   * 显示的毫秒数
   * @default 2000
   * */
  keepTime?: number;
}
interface CPNToastOption extends ToastOption {
  text: string | number;
  keepTime: number;
  animatedValue: Animated.Value;
}

interface OptionMap {
  [id: string]: CPNToastOption | undefined;
}

export function createCPNToast() {
  const ev = createSubscribeEvents<{
    trigger: {
      id: string;
      opt?: CPNToastOption;
    };
  }>();
  let ids: string[] = [];
  let idListCache: string[] = [];

  function ProviderCPNToast() {
    const [optionMap, setOptionMap] = useState<OptionMap>({});
    useEffect(() => {
      const id = ev.subscribe('trigger', ed => {
        setOptionMap(_data => ({
          ..._data,
          [ed.id]: ed.opt,
        }));
      });
      return () => ev.unsubscribe('trigger', id);
    }, []);

    const idList = useMemo(() => Object.keys(optionMap), [optionMap]);

    useEffect(() => {
      const id = idList[idList.length - 1];

      if (id && !idListCache.includes(id)) {
        idListCache.push(id);

        const option = optionMap[id];
        if (option) {
          option.animatedValue.setValue(1);
        }

        if (option && option.keepTime > 0) {
          setTimeout(() => {
            Animated.timing(option.animatedValue, {
              duration: 200,
              toValue: 0,
              useNativeDriver: false,
            }).start();
            setTimeout(() => {
              ev.publish('trigger', {id, opt: undefined});
            }, 200);
          }, option.keepTime);
        }
      }
    }, [idList, optionMap]);

    const windowDimensions = useWindowDimensions();

    return (
      <>
        {idList.map((id, index) => {
          const option = optionMap[id];
          if (!option) {
            return null;
          }
          return (
            <Animated.View
              accessibilityRole="alert"
              pointerEvents="none"
              key={id}
              style={[
                styles.container,
                {
                  backgroundColor: Colors.backgroundPanel,
                  maxWidth: windowDimensions.width * 0.6,
                  elevation: 5 + index,
                  opacity: option.animatedValue,
                },
              ]}>
              <View style={styles.content}>
                <CPNText style={[styles.text, {color: Colors.fontText}]}>
                  {option.text}
                </CPNText>
              </View>
            </Animated.View>
          );
        })}
      </>
    );
  }

  return {
    Provider: ProviderCPNToast,
    open(message: string | number, option?: ToastOption) {
      const id = getOnlyStr(ids);

      ev.publish('trigger', {
        id,
        opt: {
          keepTime: 2000,
          animatedValue: new Animated.Value(0.6),
          text: message,
          ...option,
        },
      });

      ids.push(id);

      return id;
    },
    close(id: string) {
      ev.publish('trigger', {id});
    },
  } as const;
}

export const CPNToast = createCPNToast();
