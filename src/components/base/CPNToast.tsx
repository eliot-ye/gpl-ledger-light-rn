import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, useWindowDimensions, View} from 'react-native';
import {Colors} from '@/configs/colors';
import {StyleGet} from '@/configs/styles';
import {getOnlyStr} from '@/utils/tools';
import {CPNText} from './CPNText';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';
import {createTaskQueue} from '@/libs/TaskQueue';

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

export function createCPNToast() {
  const ev = createSubscribeEvents<{
    trigger: {
      id: string;
      opt?: CPNToastOption;
    };
    clearAll: undefined;
  }>();
  let ids: string[] = [];

  function ProviderCPNToast() {
    const [option, setOption] = useState<CPNToastOption | undefined>();
    const ToastQueue = useRef(
      createTaskQueue<{
        id: string;
        opt: CPNToastOption;
      }>(async task => {
        setOption(task.opt);
        task.opt.animatedValue.setValue(1);

        return new Promise<void>(resolve => {
          if (task.opt.keepTime > 0) {
            setTimeout(() => {
              Animated.timing(task.opt.animatedValue, {
                duration: 200,
                toValue: 0,
                useNativeDriver: false,
              }).start(() => {
                setOption(undefined);
                resolve();
              });
            }, task.opt.keepTime);
          }
        });
      }),
    ).current;
    useEffect(() => {
      return ev.subscribe('trigger', ed => {
        if (!ed.opt) {
          if (ed.id !== ToastQueue.getActive()?.id) {
            ToastQueue.reset(
              ToastQueue.getQueue().filter(item => item.id !== ed.id),
            );
          } else {
            setOption(undefined);
            ToastQueue.skipCurrentTask();
          }
          return;
        }
        ToastQueue.add({id: ed.id, opt: ed.opt});
      });
    }, [ToastQueue]);

    useEffect(() => {
      return ev.subscribe('clearAll', () => {
        setOption(undefined);
        ToastQueue.clear();
        ToastQueue.skipCurrentTask();
      });
    }, [ToastQueue]);

    const windowDimensions = useWindowDimensions();

    if (!option) {
      return null;
    }

    return (
      <Animated.View
        accessibilityRole="alert"
        pointerEvents="none"
        style={[
          styles.container,
          {
            backgroundColor: Colors.backgroundPanel,
            maxWidth: windowDimensions.width * 0.6,
            elevation: 5,
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
    clearAll() {
      ev.publish('clearAll');
    },
  } as const;
}

export const CPNToast = createCPNToast();
