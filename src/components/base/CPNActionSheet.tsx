import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18n} from '@assets/I18n';
import {Colors} from '@/assets/colors';
import {getRandomStr} from '@/utils/tools';
import {CPNText} from './CPNText';
import {createSubscribeEvents} from '@/libs/SubscribeEvents';
import {StyleGet} from '@/assets/styles';
import {useDimensions} from '@/utils/useDimensions';

const Config = {
  borderRadius: 14,
  titleFontSize: 16,
  messageFontSize: 12,
  iconMargin: 10,
  buttonFontSize: 20,
  buttonIconSize: 20,
} as const;

const styles = StyleSheet.create({
  title: {
    fontSize: Config.titleFontSize,
    fontWeight: '600',
  },
  message: {
    fontSize: Config.messageFontSize,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    minHeight: 56,
  },
  buttonText: {fontSize: Config.buttonFontSize},
  buttonIcon: {width: Config.buttonIconSize, height: Config.buttonIconSize},
  cancelButton: {
    borderRadius: Config.borderRadius,
    marginTop: 8,
  },
});

interface ActionSheetButton {
  text: string;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  keep?: boolean;
}
interface CPNActionSheetButton extends ActionSheetButton {
  id: string;
}

interface ActionSheetOption<ItemB extends ActionSheetButton> {
  title?: React.ReactNode;
  message?: React.ReactNode;
  /** ___use memoized value___ */
  buttons: ItemB[];
  onPress?: (buttonData: ItemB, index: number) => void;
  showCancel?: boolean;
  closeOnClickOverlay?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  /**
   * 指示返回按钮是否关闭弹窗，仅`Android`
   * @default true
   * */
  backButtonClose?: boolean;
}

interface CPNActionSheetViewProps<ItemB extends ActionSheetButton>
  extends ActionSheetOption<ItemB> {
  show: boolean;
  onClose: () => void;
}
export function CPNActionSheetView<ItemB extends ActionSheetButton>(
  props: Readonly<CPNActionSheetViewProps<ItemB>>,
) {
  I18n.useLangCode();

  const buttonList = useMemo<CPNActionSheetButton[]>(() => {
    return props.buttons.map(_item => ({id: getRandomStr(), ..._item})) || [];
  }, [props.buttons]);

  const edgeInsets = useSafeAreaInsets();
  const boxPaddingBottom = useMemo(
    () => edgeInsets.bottom || 10,
    [edgeInsets.bottom],
  );

  const animatedValue = useRef(new Animated.Value(300)).current;
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.show) {
      setShow(true);
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 300,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setShow(false);
      });
    }
  }, [animatedValue, props.show]);

  const screenSize = useDimensions('screen');

  return (
    <Modal
      visible={show}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={() => {
        if (props.backButtonClose !== false) {
          props.onClose();
        }
      }}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          if (props.closeOnClickOverlay !== false) {
            props.onClose();
          }
        }}>
        <View
          style={[
            StyleGet.modalView(screenSize.height, 'flex-end'),
            {alignItems: 'stretch', paddingHorizontal: 8},
          ]}>
          <Animated.View
            accessibilityRole="menu"
            style={{
              paddingBottom: boxPaddingBottom,
              transform: [{translateY: animatedValue}],
            }}>
            <View
              style={{
                backgroundColor: Colors.backgroundTheme,
                borderRadius: Config.borderRadius,
              }}>
              {(!!props.title || !!props.message) && (
                <View
                  accessibilityRole="header"
                  style={{
                    alignItems: 'center',
                    paddingTop: 8,
                    paddingBottom: 12,
                  }}>
                  {!!props.title &&
                    (['string', 'number'].includes(typeof props.title) ? (
                      <CPNText
                        role="heading"
                        style={[styles.title, {color: Colors.fontTitle}]}>
                        {props.title}
                      </CPNText>
                    ) : (
                      <View role="heading">{props.title}</View>
                    ))}
                  {!!props.message &&
                    (['string', 'number'].includes(typeof props.message) ? (
                      <CPNText
                        role="contentinfo"
                        style={[styles.message, {color: Colors.fontSubtitle}]}>
                        {props.message}
                      </CPNText>
                    ) : (
                      <View role="contentinfo">{props.message}</View>
                    ))}
                </View>
              )}
              {buttonList.map((_item, _index) => {
                return (
                  <View
                    style={{
                      borderTopWidth: 0.5,
                      borderColor: Colors.line,
                    }}
                    key={_item.id}>
                    <TouchableOpacity
                      accessible
                      accessibilityRole="menuitem"
                      onPress={() => {
                        try {
                          props.onPress && props.onPress(_item as any, _index);
                        } catch (error) {
                          console.error(
                            `CPNActionSheet button [${_item.text}]:`,
                            error,
                          );
                        }
                        if (!_item.keep) {
                          props.onClose();
                        }
                      }}
                      style={[
                        styles.button,
                        _index === buttonList.length - 1 && {
                          borderBottomStartRadius: Config.borderRadius,
                          borderBottomEndRadius: Config.borderRadius,
                        },
                      ]}>
                      {!!_item.leftIcon && (
                        <Image
                          source={_item.leftIcon}
                          style={[
                            styles.buttonIcon,
                            {marginRight: Config.iconMargin},
                          ]}
                        />
                      )}
                      <CPNText
                        style={[styles.buttonText, {color: Colors.theme}]}>
                        {_item.text}
                      </CPNText>
                      {!!_item.rightIcon && (
                        <Image
                          source={_item.rightIcon}
                          style={[
                            styles.buttonIcon,
                            {marginLeft: Config.iconMargin},
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {props.showCancel !== false && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {backgroundColor: Colors.backgroundTheme},
                ]}
                onPress={() => {
                  try {
                    props.onCancel && props.onCancel();
                  } catch (error) {
                    console.error('CPNActionSheet [onCancel]:', error);
                  }
                  props.onClose();
                }}>
                <CPNText
                  style={[
                    styles.buttonText,
                    {color: Colors.warning, fontWeight: '600'},
                  ]}>
                  {props.cancelText ?? I18n.t('Cancel')}
                </CPNText>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function createCPNActionSheet() {
  const ev = createSubscribeEvents<{
    trigger: ActionSheetOption<any> | undefined;
  }>();

  function CPNActionSheet() {
    const [data, setData] = useState<undefined | ActionSheetOption<any>>();
    useEffect(() => {
      return ev.subscribe('trigger', ed => setData(ed));
    }, []);

    return (
      <CPNActionSheetView
        {...data}
        buttons={useMemo(() => data?.buttons || [], [data?.buttons])}
        show={!!data}
        onClose={() => setData(undefined)}
      />
    );
  }

  return {
    Provider: CPNActionSheet,
    open<ItemB extends ActionSheetButton>(option: ActionSheetOption<ItemB>) {
      ev.publish('trigger', option);
    },
    close() {
      ev.publish('trigger', undefined);
    },
  } as const;
}

export const CPNActionSheet = createCPNActionSheet();
