import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {I18n} from '@assets/I18n';
import {Colors} from '@/configs/colors';
import {StyleGet} from '@/configs/styles';
import {getOnlyStr, getRandomStr} from '@/utils/tools';
import {CPNText} from './CPNText';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';

const Config = {
  width: '80%',
  borderRadius: 20,
  fontSize: 14,
  titleFontSize: 18,
  titleFontWeight: '600',
  buttonHeight: 40,
  animatedSpeed: 20,
} as const;

const styles = StyleSheet.create({
  container: {
    ...StyleGet.boxShadow(),
    width: Config.width,
    position: 'absolute',
    borderRadius: Config.borderRadius,
    borderWidth: 0.5,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  text: {
    fontSize: Config.fontSize,
    textAlign: 'center',
  },
  btn: {
    height: Config.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export interface AlertButton<T> {
  text: string;
  textColor?: string;
  backgroundColor?: string;
  keep?: boolean;
  onPress?: (state: [T, React.Dispatch<T>]) => void;
}
interface CPNAlertButton<T> extends AlertButton<T> {
  id?: string;
}

interface AlertOption<T> {
  title?: React.ReactNode;
  message?:
    | React.ReactNode
    | ((option: [T, React.Dispatch<T>]) => React.JSX.Element);
  initState?: T;
  /**
   * 指示返回按钮是否关闭弹窗，仅`Android`
   * @default true
   * */
  backButtonClose?: boolean;
  /** ___use memoized value___ */
  buttons?: AlertButton<T>[];
}
interface CPNAlertOption extends AlertOption<any> {
  id: string;
  buttons: CPNAlertButton<any>[];
  animatedValue: Animated.Value;
}

interface CPNAlertBoxProps extends AlertOption<any> {
  index: number;
  animatedScale: Animated.Value;
  onClose: () => void;
}
function CPNAlertBox(props: CPNAlertBoxProps) {
  const buttonsList = useMemo(
    () =>
      props.buttons
        ? props.buttons.map(_btn => ({
            id: getRandomStr(),
            ..._btn,
          }))
        : [],
    [props.buttons],
  );

  const isColumnButtons = buttonsList.length >= 3;

  const StateObj = useState(props.initState);

  return (
    <Animated.View
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: Colors.backgroundTheme,
          borderColor: Colors.line,
          transform: [
            {translateX: props.index * 3},
            {translateY: props.index * 3},
            {scale: props.animatedScale},
          ],
          elevation: props.index + 1,
        },
      ]}>
      <View style={styles.content}>
        {!!props.title &&
          (['string', 'number'].includes(typeof props.title) ? (
            <CPNText
              role="heading"
              style={[
                styles.text,
                {
                  fontWeight: Config.titleFontWeight,
                  fontSize: Config.titleFontSize,
                  marginBottom: !props.message ? 0 : 10,
                },
              ]}>
              {props.title}
            </CPNText>
          ) : (
            <View role="heading">{props.title}</View>
          ))}
        {!!props.message && typeof props.message === 'function' ? (
          <View role="contentinfo">{props.message(StateObj)}</View>
        ) : ['string', 'number'].includes(typeof props.message) ? (
          <CPNText role="contentinfo" style={[styles.text]}>
            {props.message}
          </CPNText>
        ) : (
          <View role="contentinfo">{props.message}</View>
        )}
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.line,
          flexDirection: isColumnButtons ? 'column' : 'row-reverse',
        }}>
        {buttonsList.map((_btn, _btnIndex) => {
          const isFirst = _btnIndex === 0;
          const isLast = _btnIndex === buttonsList.length - 1;

          return (
            <View
              key={`${_btn.id}`}
              style={[
                {flex: 1, borderColor: Colors.line},

                !isColumnButtons &&
                  _btnIndex > 0 && {
                    borderRightWidth: 1,
                  },
                isColumnButtons &&
                  _btnIndex > 0 && {
                    borderTopWidth: 1,
                  },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  try {
                    _btn.onPress && _btn.onPress(StateObj);
                  } catch (error) {
                    console.error(`CPNAlert button [${_btn.text}]:`, error);
                  }
                  if (!_btn.keep) {
                    props.onClose();
                  }
                }}
                style={[
                  styles.btn,
                  {
                    backgroundColor: _btn.backgroundColor,
                  },
                  !isColumnButtons &&
                    isFirst && {
                      borderBottomStartRadius: Config.borderRadius,
                    },
                  !isColumnButtons &&
                    isLast && {
                      borderBottomEndRadius: Config.borderRadius,
                    },
                  isColumnButtons &&
                    isLast && {
                      borderBottomStartRadius: Config.borderRadius,
                      borderBottomEndRadius: Config.borderRadius,
                    },
                ]}>
                <CPNText
                  style={{
                    fontWeight: '500',
                    fontSize: Config.fontSize,
                    color: _btn.textColor || Colors.fontText,
                  }}>
                  {_btn.text}
                </CPNText>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

interface CPNAlertViewProps<T> extends AlertOption<T> {
  show: boolean;
  onClose: () => void;
}
export function CPNAlertView<T>(props: CPNAlertViewProps<T>) {
  I18n.useLocal();

  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (props.show) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [animatedValue, props.show]);

  return (
    <Modal
      visible={props.show}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={() => {
        if (props.backButtonClose !== false) {
          props.onClose();
        }
      }}>
      <View style={StyleGet.modalView()}>
        {
          <CPNAlertBox
            {...props}
            index={1}
            animatedScale={animatedValue}
            buttons={useMemo(
              () =>
                props.buttons || [
                  {text: I18n.t('Confirm'), textColor: Colors.theme},
                ],
              [props.buttons],
            )}
          />
        }
      </View>
    </Modal>
  );
}

export function createCPNAlert() {
  let ids: string[] = [];
  const eventInstance = createSubscribeEvents<{
    close: string;
    show: CPNAlertOption;
  }>();

  function CPNAlert() {
    const [alertOptionList, setAlertOptionList] = useState<CPNAlertOption[]>(
      [],
    );
    useEffect(() => {
      const showId = eventInstance.subscribe('show', opt => {
        setAlertOptionList(_opts => [..._opts, opt]);
      });
      const closeId = eventInstance.subscribe('close', id => {
        setAlertOptionList(_opts => {
          const index = _opts.map(_item => _item.id).indexOf(id);
          if (index > -1) {
            _opts.splice(index, 1);
          }
          return [..._opts];
        });
      });

      return () => {
        eventInstance.unsubscribe('show', showId);
        eventInstance.unsubscribe('close', closeId);
      };
    }, []);

    const alertOptionListLength = useRef(0);
    useEffect(() => {
      if (alertOptionListLength.current < alertOptionList.length) {
        Animated.spring(
          alertOptionList[alertOptionList.length - 1].animatedValue,
          {
            toValue: 1,
            speed: Config.animatedSpeed,
            useNativeDriver: false,
          },
        ).start();
      }
      alertOptionListLength.current = alertOptionList.length;
    }, [alertOptionList]);

    return (
      <Modal
        visible={alertOptionList.length > 0}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => {
          const alertOption = alertOptionList[alertOptionList.length - 1];
          if (alertOption && alertOption.backButtonClose) {
            eventInstance.publish(
              'close',
              alertOptionList[alertOptionList.length - 1].id,
            );
          }
        }}>
        <View style={StyleGet.modalView()}>
          {alertOptionList.map((_item, _index) => {
            return (
              <CPNAlertBox
                {..._item}
                key={_item.id}
                index={_index}
                animatedScale={_item.animatedValue}
                onClose={() => {
                  Animated.spring(_item.animatedValue, {
                    toValue: 0,
                    speed: Config.animatedSpeed,
                    useNativeDriver: false,
                  }).start(() => {
                    if (_index > 0) {
                      eventInstance.publish('close', _item.id);
                    }
                  });
                  if (_index === 0) {
                    setTimeout(() => {
                      eventInstance.publish('close', _item.id);
                    }, 100);
                  }
                }}
              />
            );
          })}
        </View>
      </Modal>
    );
  }

  return {
    Provider: CPNAlert,
    /**
     * @param option
     * @returns `Id` 用于 `CPNAlert.close`
     */
    open<T>(option: AlertOption<T>) {
      const id = getOnlyStr(ids);
      eventInstance.publish('show', {
        id,
        backButtonClose: true,
        buttons: [{text: I18n.t('Confirm')}],
        animatedValue: new Animated.Value(0),
        ...option,
      });

      return id;
    },
    close(id: string) {
      eventInstance.publish('close', id);
    },
    alert(title: React.ReactNode, message?: React.ReactNode) {
      return new Promise<void>(resolve => {
        const id = getOnlyStr(ids);
        eventInstance.publish('show', {
          id,
          backButtonClose: true,
          animatedValue: new Animated.Value(0),
          title,
          message,
          buttons: [
            {
              text: I18n.t('Confirm'),
              textColor: Colors.theme,
              onPress: () => resolve(),
            },
          ],
        });
      });
    },
    confirm(title: React.ReactNode, message?: React.ReactNode) {
      return new Promise<void>((resolve, reject) => {
        const id = getOnlyStr(ids);
        eventInstance.publish('show', {
          id,
          backButtonClose: true,
          animatedValue: new Animated.Value(0),
          title,
          message,
          buttons: [
            {
              text: I18n.t('Confirm'),
              textColor: Colors.theme,
              onPress: () => resolve(),
            },
            {text: I18n.t('Cancel'), onPress: () => reject()},
          ],
        });
      });
    },
  } as const;
}

export const CPNAlert = createCPNAlert();
