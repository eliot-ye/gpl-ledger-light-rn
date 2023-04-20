import React, {useMemo} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@/configs/colors';
import {CPNText} from './CPNText';
import {I18n} from '@/assets/I18n';
import {CPNIonicons, IONName} from './CPNIcon';
import {StyleGet} from '@/configs/styles';
import {navigationRef} from '@/view/Router';

export const headerIconStyles = StyleSheet.create({
  font: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

const styles = StyleSheet.create({
  fixedTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrapper: {
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  leftBtnWrapper: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
  },
  rightBtnWrapper: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
  },
});

export interface CPNHeaderProps {
  fixedTop?: boolean;
  backgroundColor?:
    | string
    | Animated.Value
    | Animated.AnimatedInterpolation<string>;
  leftIcon?: React.ReactNode | React.ReactNode[];
  leftIconType?: 'close';
  /** ___use memoized value___ */
  onPressLeftIcon?: () => void;
  title?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;
  rightIcon?: boolean | React.ReactNode | React.ReactNode[];
  hideBack?: boolean;
  backIconStyle?: StyleProp<TextStyle>;
  safeArea?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  showShadow?: boolean;
}
export function CPNHeader(props: CPNHeaderProps) {
  const backIcon = useMemo(() => {
    const canGoBack =
      navigationRef && navigationRef.isReady() && navigationRef.canGoBack();

    if (props.hideBack || (!props.onPressLeftIcon && !canGoBack)) {
      return null;
    }

    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={I18n.GoBack}
        onPress={
          props.onPressLeftIcon ||
          (canGoBack && navigationRef.goBack) ||
          undefined
        }>
        {props.leftIconType === 'close' ? (
          <CPNIonicons
            name={props.showShadow ? IONName.Close : IONName.CloseCircle}
            size={props.showShadow ? 26 : 30}
            color={Colors.fontTitleReverse}
          />
        ) : (
          <CPNIonicons
            name={props.showShadow ? IONName.Back : IONName.BackCircle}
            size={props.showShadow ? 26 : 30}
            color={Colors.fontTitleReverse}
          />
        )}
      </TouchableOpacity>
    );
  }, [
    props.showShadow,
    props.hideBack,
    props.leftIconType,
    props.onPressLeftIcon,
  ]);

  function renderLeftIcon() {
    return props.leftIcon || backIcon;
  }

  function renderTitle() {
    return ['string', 'number'].includes(typeof props.title) ? (
      <CPNText
        role="heading"
        style={[StyleGet.title('h2', true), props.titleStyle]}>
        {props.title}
      </CPNText>
    ) : (
      props.title
    );
  }

  const edgeInsets = useSafeAreaInsets();

  return (
    <Animated.View
      role="navigation"
      onLayout={props.onLayout}
      style={[
        props.showShadow && StyleGet.boxShadow(),
        props.fixedTop && styles.fixedTop,
        props.safeArea && {paddingTop: edgeInsets.top},
        {
          backgroundColor: props.backgroundColor,
        },
      ]}>
      <View style={styles.container}>
        <View style={[styles.box, styles.titleWrapper]}>{renderTitle()}</View>
        <View style={[styles.box, styles.leftBtnWrapper]}>
          {renderLeftIcon()}
        </View>
        <View style={[styles.box, styles.rightBtnWrapper]}>
          {props.rightIcon}
        </View>
      </View>
    </Animated.View>
  );
}
