import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  type ScrollViewProps,
  View,
  Animated,
  StatusBar,
  Platform,
  Keyboard,
  type ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors, ColorsInstance} from '@/assets/colors';
import {CPNHeader, type CPNHeaderProps} from './CPNHeader';
import {useDimensions} from '@/utils/dimensions';
import {CPNLoadingView} from '.';

export enum BarTextStyle {
  light = 'light-content',
  dark = 'dark-content',
}

export const CPNPageViewThemeColor = createContext('');
export const CPNPageViewScrollViewCtx = createContext<ScrollView | null>(null);
export const CPNPageViewContentOffsetYCtx = createContext(0);
export const CPNPageViewBottomInsetCtx = createContext(0);

interface CPNPageViewProps extends ScrollViewProps, CPNHeaderProps {
  theme?: string;
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
  loading?: boolean;
}
/**
 * - style 作用于 ScrollView
 */
export function CPNPageView(props: Readonly<CPNPageViewProps>) {
  ColorsInstance.useCode();
  const themeColor = props.theme ?? Colors.theme;
  const headerBackgroundColor = props.headerBackgroundColor ?? themeColor;

  const bottomInset = useContext(CPNPageViewBottomInsetCtx);

  const [contentOffsetY, setContentOffsetY] = useState(0);
  const [topNegativeDistance, setTopNegativeDistance] = useState(0);

  const topDistanceAnimated = useRef(new Animated.Value(0)).current;

  const [headerInfo, setHeaderInfo] = useState({width: 0, height: 0});
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
        textColor={Colors.fontTitleReverse}
        backgroundColor={
          props.fixedTop
            ? scrollDistanceAnimated.interpolate<string>({
                inputRange: [0, props.transparentScrollRange ?? 200],
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
          setHeaderInfo({
            width: ev.nativeEvent.layout.width,
            height: ev.nativeEvent.layout.height,
          })
        }
      />
    );
  }

  const edgeInsets = useSafeAreaInsets();
  const windowSize = useDimensions('window');
  const ScrollViewRef = useRef<ScrollView>(null);

  return (
    <CPNPageViewThemeColor.Provider value={themeColor}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.backgroundTheme,
        }}>
        <StatusBar
          barStyle={props.barStyle ?? BarTextStyle.light}
          backgroundColor={Colors.transparent}
          translucent
        />
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          {...props}
          ref={ScrollViewRef}
          style={[
            {
              flex: 1,
              paddingLeft: edgeInsets.left,
              paddingRight: edgeInsets.right,
            },
            props.style,
          ]}
          onScroll={ev => {
            const _contentOffsetY = ev.nativeEvent.contentOffset.y;
            setContentOffsetY(_contentOffsetY);
            scrollDistanceAnimated.setValue(_contentOffsetY);
            if (
              Platform.OS === 'ios' &&
              props.renderIOSTopNegativeDistanceView
            ) {
              setTopNegativeDistance(
                _contentOffsetY < 0 ? -_contentOffsetY : 0,
              );
              topDistanceAnimated.setValue(
                _contentOffsetY > 0 ? -_contentOffsetY : 0,
              );
            }
            props.onScroll && props.onScroll(ev);
          }}>
          <View
            style={{
              minHeight: windowSize.height,
              paddingBottom: bottomInset || edgeInsets.bottom,
            }}>
            {!props.fixedTop && <View style={{height: headerInfo.height}} />}
            <CPNPageViewScrollViewCtx.Provider value={ScrollViewRef.current}>
              <CPNPageViewContentOffsetYCtx.Provider value={contentOffsetY}>
                {props.children}
              </CPNPageViewContentOffsetYCtx.Provider>
            </CPNPageViewScrollViewCtx.Provider>
            <KeyboardAvoidingView />
          </View>
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
        <CPNLoadingView show={props.loading ?? false} />
      </View>
    </CPNPageViewThemeColor.Provider>
  );
}
function KeyboardAvoidingView() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const emitter1 = Keyboard.addListener('keyboardWillShow', ev => {
      setKeyboardHeight(ev.endCoordinates.height);
    });
    const emitter2 = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      emitter1.remove();
      emitter2.remove();
    };
  }, []);

  return <View style={{height: keyboardHeight}} />;
}
