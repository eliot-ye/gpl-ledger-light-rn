import {I18n} from '@/assets/I18n';
import {Colors} from '@/configs/colors';
import {StyleGet} from '@/configs/styles';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {CPNIonicons, IONName} from './CPNIcon';
import {CPNImage} from './CPNImage';
import {CPNText} from './CPNText';

const Config = {
  btnHeight: 46,
  statusMarkSize: 30,
  padding: 10,
  borderWidth: 0.5,
  sliderBorderRadius: 10,
  minSliderDx: 10,
} as const;

const styles = StyleSheet.create({
  initBtnWrapper: {
    ...StyleGet.boxShadow(),
    borderWidth: Config.borderWidth,
    paddingHorizontal: Config.padding,
  },
  initBtn: {
    height: Config.btnHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusMarkWrapper: {
    width: Config.statusMarkSize,
    height: Config.statusMarkSize,
    borderRadius: Config.statusMarkSize / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Config.padding,
  },
  statusMark: {
    width: Config.statusMarkSize / 3,
    height: Config.statusMarkSize / 3,
    borderRadius: Config.statusMarkSize / 5,
  },

  container: {
    ...StyleGet.boxShadow(),
    position: 'absolute',
    borderWidth: Config.borderWidth,
    alignItems: 'center',
  },

  slideRail: {
    height: Config.btnHeight,
    borderRadius: Config.sliderBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    ...StyleGet.boxShadow(),
    height: Config.btnHeight,
    borderRadius: Config.sliderBorderRadius,
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export enum ValidatorStatus {
  Waiting = 0,
  Successful = 1,
  Fail = 2,
}

interface ClickVerificationTrue {
  isVerification: true;
}
interface ClickVerificationFalse {
  isVerification: false;
  /** @default Config.minSliderDx */
  minSliderDx?: number;
  sliderDy: number;
  sliderWidth: number;
  sliderHeight: number;
  sliderUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageUrl: string;
}

interface CPNSliderValidatorProps {
  onClickVerification: () => Promise<
    ClickVerificationTrue | ClickVerificationFalse
  >;
  onSliderVerification: (dx: number) => Promise<boolean>;
  onRefresh?: () => Promise<ClickVerificationTrue | ClickVerificationFalse>;
  clickTipsText?: string;
  successfulText?: string;
  failText?: string;
  sliderTipsText?: string;
  /** @default Config.minSliderDx */
  minSliderDx?: number;
  /** 自定义按钮内容，需返回一个带 `pointerEvents="none"` 的 View */
  renderButtonView?: (data: {
    status: ValidatorStatus;
    isLoading: boolean;
  }) => React.ReactNode;
}

export function CPNSliderValidator(props: CPNSliderValidatorProps) {
  const [show, showSet] = useState(false);

  const [isLoading, isLoadingSet] = useState(false);

  const VerificationSuccessful =
    props.successfulText || I18n.VerificationSuccessful;
  const VerificationFailed = props.clickTipsText || I18n.VerificationFailed;
  const VerificationWaiting = props.clickTipsText || I18n.ClickToVerify;
  const SliderTipsText = props.sliderTipsText || I18n.CompletePuzzle;

  const [validatorStatus, validatorStatusSet] = useState<ValidatorStatus>(
    ValidatorStatus.Waiting,
  );

  const [boxPosition, boxPositionSet] = useState({Y: 0, X: 0});
  const [boxInfo, boxInfoSet] = useState({width: 0, height: 0});

  const [validatorInfo, validatorInfoSet] = useState({
    sliderDy: 0,
    sliderWidth: 0,
    sliderHeight: 0,
    sliderUrl: '',
    imageWidth: 0,
    imageHeight: 0,
    imageUrl: '',
  });

  function renderButtonView() {
    return (
      <TouchableOpacity
        style={[
          styles.initBtnWrapper,
          {
            borderColor: Colors.line,
            backgroundColor: Colors.backgroundPanel,
          },
          validatorStatus === ValidatorStatus.Successful && {
            shadowColor: Colors.success,
            borderColor: Colors.success,
            backgroundColor: Colors.successLight,
          },
          validatorStatus === ValidatorStatus.Fail && {
            shadowColor: Colors.fail,
            borderColor: Colors.fail,
            backgroundColor: Colors.failLight,
          },
        ]}
        disabled={isLoading || validatorStatus === ValidatorStatus.Successful}
        onLayout={ev => {
          boxInfoSet({
            width: ev.nativeEvent.layout.width,
            height: ev.nativeEvent.layout.height,
          });
        }}
        onPress={async ev => {
          boxPositionSet({
            Y: ev.nativeEvent.pageY - ev.nativeEvent.locationY,
            X: ev.nativeEvent.pageX - ev.nativeEvent.locationX,
          });

          validatorStatusSet(ValidatorStatus.Waiting);
          isLoadingSet(true);
          try {
            const _validatorInfo = await props.onClickVerification();

            if (!_validatorInfo.isVerification) {
              if (_validatorInfo.minSliderDx !== undefined) {
                minSliderDx.current = _validatorInfo.minSliderDx;
              }
              validatorInfoSet(_validatorInfo);
              showSet(true);
            } else {
              validatorStatusSet(ValidatorStatus.Successful);
            }
          } catch (error) {
            validatorStatusSet(ValidatorStatus.Fail);
          }
          isLoadingSet(false);
        }}>
        {props.renderButtonView ? (
          props.renderButtonView({status: validatorStatus, isLoading})
        ) : (
          <View pointerEvents="none" style={[styles.initBtn]}>
            {validatorStatus === ValidatorStatus.Successful && (
              <>
                <CPNIonicons
                  name={IONName.CheckboxMarkedCircleOutline}
                  size={Config.statusMarkSize}
                  color={Colors.success}
                  style={{marginRight: Config.padding}}
                />
                <CPNText>{VerificationSuccessful}</CPNText>
              </>
            )}
            {validatorStatus === ValidatorStatus.Fail && (
              <>
                <CPNIonicons
                  name={IONName.AlertCircleOutline}
                  size={Config.statusMarkSize}
                  color={Colors.fail}
                  style={{marginRight: Config.padding}}
                />
                <CPNText>{VerificationFailed}</CPNText>
              </>
            )}
            {validatorStatus === ValidatorStatus.Waiting && (
              <>
                <IconValidator isLoading={isLoading} />
                <CPNText>{VerificationWaiting}</CPNText>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  const windowDimensions = useWindowDimensions();
  const containerStyle = useMemo(() => {
    const _style: ViewStyle = {};

    const boxMinWidth = validatorInfo.imageWidth + Config.padding * 2;
    if (boxInfo.width < windowDimensions.width && boxInfo.width > boxMinWidth) {
      _style.width = boxInfo.width;
      _style.left = boxPosition.X;
    } else if (boxMinWidth + boxPosition.X < windowDimensions.width) {
      _style.left = boxPosition.X;
    } else if (
      boxMinWidth + (windowDimensions.width - boxPosition.X - boxInfo.width) <
      windowDimensions.width
    ) {
      _style.right = windowDimensions.width - boxPosition.X - boxInfo.width;
    }

    const containerHeight =
      Config.btnHeight * 2 + Config.padding * 2 + validatorInfo.imageHeight;
    const isShowBottom =
      containerHeight + boxPosition.Y < windowDimensions.height - 50;
    if (isShowBottom) {
      _style.top = boxPosition.Y;
    } else {
      _style.bottom =
        windowDimensions.height - boxPosition.Y - Config.btnHeight;
    }

    return _style;
  }, [
    boxInfo.width,
    boxPosition.X,
    boxPosition.Y,
    validatorInfo.imageWidth,
    validatorInfo.imageHeight,
    windowDimensions.height,
    windowDimensions.width,
  ]);

  const minSliderDx = useRef(
    props.minSliderDx !== undefined ? props.minSliderDx : Config.minSliderDx,
  );
  const translateXAnimated = useRef(new Animated.Value(0)).current;
  const translateX = useRef(0);
  const panResponderInstance = useMemo(() => {
    async function onTouchMoveEnd(dx: number) {
      if (dx < minSliderDx.current) {
        validatorStatusSet(ValidatorStatus.Waiting);
        translateX.current = 0;
        Animated.timing(translateXAnimated, {
          toValue: translateX.current,
          useNativeDriver: true,
        }).start();
        return;
      }

      isLoadingSet(true);
      try {
        const isVerification = await props.onSliderVerification(
          translateX.current,
        );
        if (!isVerification) {
          validatorStatusSet(ValidatorStatus.Fail);
          translateX.current = 0;
          Animated.timing(translateXAnimated, {
            toValue: translateX.current,
            useNativeDriver: true,
          }).start();
        } else {
          validatorStatusSet(ValidatorStatus.Successful);
          setTimeout(() => {
            showSet(false);
          }, 2000);
        }
      } catch (error) {}
      isLoadingSet(false);
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => !isLoading,
      onPanResponderGrant: () => {
        validatorStatusSet(ValidatorStatus.Waiting);
      },
      onPanResponderMove: (_ev, ge) => {
        if (
          ge.dx > 0 &&
          ge.dx < validatorInfo.imageWidth - validatorInfo.sliderWidth
        ) {
          translateX.current = ge.dx;
          translateXAnimated.setValue(translateX.current);
        }
      },
      onPanResponderEnd: (_ev, ge) => {
        // console.log('onPanResponderEnd', ge.dx);
        onTouchMoveEnd(ge.dx);
      },
      onPanResponderTerminate: (_ev, ge) => {
        // console.log('onPanResponderTerminate');
        onTouchMoveEnd(ge.dx);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    validatorInfo.sliderWidth,
    validatorInfo.imageWidth,
    translateXAnimated,
    isLoading,
    validatorStatus,
  ]);

  function renderModalView() {
    return (
      <Modal
        visible={show}
        transparent
        statusBarTranslucent
        animationType="fade">
        <TouchableWithoutFeedback onPress={() => showSet(false)}>
          <View style={[StyleGet.windowSize(), {alignItems: 'center'}]}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View
                style={[
                  styles.container,
                  containerStyle,
                  {
                    backgroundColor: Colors.backgroundPanel,
                    borderColor: Colors.line,
                  },
                  validatorStatus === ValidatorStatus.Successful && {
                    shadowColor: Colors.success,
                    borderColor: Colors.success,
                  },
                ]}>
                <View style={{padding: Config.padding}}>
                  <ImageBackground
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    source={{uri: validatorInfo.imageUrl || undefined}}
                    style={{
                      width: validatorInfo.imageWidth,
                      height: validatorInfo.imageHeight,
                      marginBottom: Config.padding,
                      justifyContent: 'flex-end',
                    }}>
                    <Animated.View
                      style={{
                        position: 'absolute',
                        top: validatorInfo.sliderDy,
                        transform: [{translateX: translateXAnimated}],
                      }}>
                      <CPNImage
                        source={{uri: validatorInfo.sliderUrl || undefined}}
                        style={{
                          width: validatorInfo.sliderWidth,
                          height: validatorInfo.sliderHeight,
                        }}
                      />
                    </Animated.View>
                  </ImageBackground>
                  <View
                    style={[
                      styles.slideRail,
                      {
                        width: validatorInfo.imageWidth,
                        backgroundColor: Colors.backgroundTheme,
                      },
                      validatorStatus === ValidatorStatus.Successful && {
                        backgroundColor: Colors.successLight,
                        borderColor: Colors.success,
                        borderWidth: 1,
                      },
                    ]}>
                    {validatorStatus === ValidatorStatus.Successful ? (
                      <CPNIonicons
                        name={IONName.CheckboxMarkedCircleOutline}
                        size={Config.statusMarkSize}
                        color={Colors.success}
                      />
                    ) : (
                      <CPNText>{SliderTipsText}</CPNText>
                    )}
                    {validatorStatus !== ValidatorStatus.Successful && (
                      <Animated.View
                        accessibilityValue={{
                          now: translateX.current,
                          min: 0,
                          max: Math.floor(
                            validatorInfo.imageWidth -
                              validatorInfo.sliderWidth,
                          ),
                        }}
                        style={[
                          styles.slider,
                          {
                            width: validatorInfo.sliderWidth,
                            backgroundColor: Colors.backgroundPanel,
                            transform: [{translateX: translateXAnimated}],
                          },
                        ]}
                        {...panResponderInstance.panHandlers}>
                        {isLoading ? (
                          <ActivityIndicator />
                        ) : (
                          <CPNIonicons
                            name={IONName.Slider}
                            color={Colors.fontTitle}
                          />
                        )}
                      </Animated.View>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    width: '100%',
                    borderBottomWidth: Config.borderWidth,
                    borderColor: Colors.line,
                  }}
                />

                <View
                  style={{
                    width: '100%',
                    paddingVertical: Config.padding,
                    paddingHorizontal: Config.padding * 2,
                    height: Config.btnHeight,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    accessibilityLabel={I18n.Close}
                    style={{marginRight: 10}}
                    onPress={() => showSet(false)}>
                    <CPNIonicons
                      name={IONName.CloseCircle}
                      color={Colors.fontSubtitle}
                    />
                  </TouchableOpacity>
                  {!!props.onRefresh && (
                    <TouchableOpacity
                      accessibilityLabel={I18n.Refresh}
                      style={{marginRight: 10}}
                      onPress={async () => {
                        validatorStatusSet(ValidatorStatus.Waiting);
                        if (props.onRefresh) {
                          isLoadingSet(true);
                          try {
                            const _validatorInfo = await props.onRefresh();
                            if (!_validatorInfo.isVerification) {
                              if (_validatorInfo.minSliderDx !== undefined) {
                                minSliderDx.current =
                                  _validatorInfo.minSliderDx;
                              }
                              validatorInfoSet(_validatorInfo);
                            }
                          } catch (error) {}
                          isLoadingSet(false);
                        }
                      }}>
                      <CPNIonicons
                        name={IONName.Refresh}
                        color={Colors.fontSubtitle}
                      />
                    </TouchableOpacity>
                  )}
                  {validatorStatus === ValidatorStatus.Successful && (
                    <View
                      accessibilityRole="alert"
                      style={{
                        height: '90%',
                        justifyContent: 'center',
                        borderLeftWidth: 1,
                        borderColor: Colors.line,
                        paddingLeft: Config.padding,
                      }}>
                      <CPNText style={{color: Colors.success, fontSize: 12}}>
                        {VerificationSuccessful}
                      </CPNText>
                    </View>
                  )}
                  {validatorStatus === ValidatorStatus.Fail && (
                    <View
                      accessibilityRole="alert"
                      style={{
                        height: '90%',
                        justifyContent: 'center',
                        borderLeftWidth: 1,
                        borderColor: Colors.line,
                        paddingLeft: Config.padding,
                      }}>
                      <CPNText style={{color: Colors.fail, fontSize: 12}}>
                        {VerificationFailed}
                      </CPNText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <>
      {renderButtonView()}
      {renderModalView()}
    </>
  );
}

interface IconValidatorProps {
  isLoading?: boolean;
}
function IconValidator(props: IconValidatorProps) {
  const scaleAnimated = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnimated, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimated, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleAnimated.stopAnimation();
      scaleAnimated.setValue(1);
    }
  }, [props.isLoading, scaleAnimated]);

  return (
    <View
      style={[
        styles.statusMarkWrapper,
        {
          backgroundColor: Colors.themeLight,
          borderColor: Colors.theme,
        },
      ]}>
      <Animated.View
        style={[
          styles.statusMark,
          {
            backgroundColor: Colors.theme,
            transform: [{scale: scaleAnimated}],
          },
        ]}
      />
    </View>
  );
}
