import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
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
import {CPNPageViewThemeColor} from './CPNPageView';

const Config = {
  width: '80%',
  borderRadius: 14,
  fontSize: 16,
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

export interface AlertButton {
  text: string;
  textColor?: string;
  backgroundColor?: string;
  keep?: boolean;
  onPress?: () => void;
}
interface CPNAlertButton extends AlertButton {
  id?: string;
}

interface AlertOption {
  title?: React.ReactNode;
  message?: React.ReactNode;
  /**
   * 指示返回按钮是否关闭弹窗，仅`Android`
   * @default true
   * */
  backButtonClose?: boolean;
  /** ___use memoized value___ */
  buttons?: AlertButton[];
}
interface CPNAlertOption extends AlertOption {
  id: string;
  buttons: CPNAlertButton[];
  animatedValue: Animated.Value;
}

interface CPNAlertBoxProps extends AlertOption {
  index: number;
  animatedScale: Animated.Value;
  onClose: () => void;
}
function CPNAlertBox(props: CPNAlertBoxProps) {
  const themeColor = useContext(CPNPageViewThemeColor) || Colors.theme;

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

  return (
    <Animated.View
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: Colors.backgroundTheme,
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
                  color: themeColor,
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
        {!!props.message &&
          (['string', 'number'].includes(typeof props.message) ? (
            <CPNText
              role="contentinfo"
              style={[styles.text, {color: themeColor}]}>
              {props.message}
            </CPNText>
          ) : (
            <View role="contentinfo">{props.message}</View>
          ))}
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: Colors.line,
          flexDirection: isColumnButtons ? 'column' : 'row',
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
                    borderLeftWidth: 1,
                  },
                isColumnButtons &&
                  _btnIndex > 0 && {
                    borderTopWidth: 1,
                  },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  try {
                    _btn.onPress && _btn.onPress();
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
                    color:
                      _btn.textColor ||
                      (!isColumnButtons && isLast) ||
                      (isColumnButtons && isFirst)
                        ? themeColor
                        : undefined,
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

interface CPNAlertViewProps extends AlertOption {
  show: boolean;
  onClose: () => void;
}
export function CPNAlertView(props: CPNAlertViewProps) {
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
              () => props.buttons || [{text: I18n.t('OK')}],
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
  const showEv = createSubscribeEvents<CPNAlertOption>();
  const closeEv = createSubscribeEvents<string>();

  function CPNAlert() {
    const [alertOptionList, setAlertOptionList] = useState<CPNAlertOption[]>(
      [],
    );
    useEffect(() => {
      const showId = showEv.subscribe(opt => {
        setAlertOptionList(_opts => [..._opts, opt]);
      });
      const closeId = closeEv.subscribe(id => {
        setAlertOptionList(_opts => {
          const index = _opts.map(_item => _item.id).indexOf(id);
          if (index > -1) {
            _opts.splice(index, 1);
          }
          return [..._opts];
        });
      });

      return () => {
        showEv.unsubscribe(showId);
        closeEv.unsubscribe(closeId);
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
            closeEv.publish(alertOptionList[alertOptionList.length - 1].id);
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
                      closeEv.publish(_item.id);
                    }
                  });
                  if (_index === 0) {
                    setTimeout(() => {
                      closeEv.publish(_item.id);
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
    open(option: AlertOption) {
      const id = getOnlyStr(ids);
      showEv.publish({
        id,
        backButtonClose: true,
        buttons: [{text: I18n.t('Confirm')}],
        animatedValue: new Animated.Value(0),
        ...option,
      });

      return id;
    },
    close(id: string) {
      closeEv.publish(id);
    },
    /**
     * @returns `Id` 用于 `CPNAlert.close`
     */
    alert(title: React.ReactNode, message?: React.ReactNode) {
      return new Promise<string>(resolve => {
        const id = getOnlyStr(ids);
        showEv.publish({
          id,
          backButtonClose: true,
          animatedValue: new Animated.Value(0),
          title,
          message,
          buttons: [{text: I18n.t('Confirm'), onPress: () => resolve(id)}],
        });
      });
    },
    /**
     * @returns `Id` 用于 `CPNAlert.close`
     */
    confirm(title: React.ReactNode, message?: React.ReactNode) {
      return new Promise<string>((resolve, reject) => {
        const id = getOnlyStr(ids);
        showEv.publish({
          id,
          backButtonClose: true,
          animatedValue: new Animated.Value(0),
          title,
          message,
          buttons: [
            {text: I18n.t('Cancel'), onPress: () => reject(id)},
            {text: I18n.t('Confirm'), onPress: () => resolve(id)},
          ],
        });
      });
    },
  } as const;
}

export const CPNAlert = createCPNAlert();
