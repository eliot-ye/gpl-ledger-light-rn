import React, {useRef, useState} from 'react';
import {
  type ScrollViewProps,
  View,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '@/configs/colors';
import {CPNHeader, type CPNHeaderProps} from './CPNHeader';

export enum BarTextStyle {
  light = 'light-content',
  dark = 'dark-content',
}

interface CPNPageViewProps extends ScrollViewProps, CPNHeaderProps {
  /** @default true */
  showHeader?: boolean;
  headerBackgroundColor?: string;
  /** @default BarTextStyle.light */
  barStyle?: BarTextStyle;
  /** @default 200 */
  transparentScrollRange?: number;

  /** @deprecated `backgroundColor` 不起作用, 请使用 `headerBackgroundColor` */
  backgroundColor?: any;
  renderIOSTopNegativeDistanceView?: (
    scrollDistance: number,
  ) => React.ReactNode;
}
/**
 * - style 作用于 ScrollView
 */
export function CPNPageView(props: CPNPageViewProps) {
  const headerBackgroundColor = props.headerBackgroundColor || Colors.theme;

  const [topNegativeDistance, topNegativeDistanceSet] = useState(0);

  const topDistanceAnimated = useRef(new Animated.Value(0)).current;

  const [headerInfo, headerInfoSet] = useState({width: 0, height: 0});
  const scrollDistanceAnimated = useRef(new Animated.Value(0)).current;
  function renderHeader() {
    if (props.showHeader === false) {
      return null;
    }
    return (
      <CPNHeader
        safeArea
        {...props}
        fixedTop
        showShadow={!props.fixedTop}
        backgroundColor={
          props.fixedTop
            ? scrollDistanceAnimated.interpolate<string>({
                inputRange: [0, props.transparentScrollRange || 200],
                outputRange: [Colors.transparent, headerBackgroundColor],
                extrapolate: 'clamp',
              })
            : headerBackgroundColor
        }
        titleStyle={[
          props.barStyle === BarTextStyle.dark && {color: Colors.fontTitle},
          props.titleStyle,
        ]}
        onLayout={ev =>
          headerInfoSet({
            width: ev.nativeEvent.layout.width,
            height: ev.nativeEvent.layout.height,
          })
        }
      />
    );
  }

  const edgeInsets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundTheme,
      }}>
      <StatusBar
        barStyle={props.barStyle || BarTextStyle.light}
        backgroundColor={Colors.transparent}
        translucent
      />

      {!props.fixedTop && <View style={{height: headerInfo.height}} />}

      <Animated.ScrollView
        {...props}
        style={[
          {
            flex: 1,
            paddingLeft: edgeInsets.left,
            paddingRight: edgeInsets.right,
          },
          props.style,
        ]}
        onScroll={
          props.fixedTop
            ? ev => {
                const contentOffsetY = ev.nativeEvent.contentOffset.y;
                if (
                  Platform.OS === 'ios' &&
                  props.renderIOSTopNegativeDistanceView
                ) {
                  topNegativeDistanceSet(
                    contentOffsetY < 0 ? -contentOffsetY : 0,
                  );
                  topDistanceAnimated.setValue(
                    contentOffsetY > 0 ? -contentOffsetY : 0,
                  );
                }
                scrollDistanceAnimated.setValue(contentOffsetY);
                props.onScroll && props.onScroll(ev);
              }
            : props.onScroll
        }>
        {props.children}
        <View style={{height: edgeInsets.bottom}} />
      </Animated.ScrollView>

      {Platform.OS === 'ios' && props.renderIOSTopNegativeDistanceView ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: topDistanceAnimated,
            width: '100%',
          }}>
          {props.renderIOSTopNegativeDistanceView(topNegativeDistance)}
        </Animated.View>
      ) : null}

      {renderHeader()}
    </View>
  );
}
