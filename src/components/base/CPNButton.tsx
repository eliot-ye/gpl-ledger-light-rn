import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {CPNText, CTextStyle, FontColorContext} from './CPNText';
import {Colors} from '@/assets/colors';
import {StyleGet} from '@/assets/styles';
import {CPNPageViewThemeColor} from './CPNPageView';

const Config = {
  height: 60,
  borderRadius: 30,
} as const;

const styles = StyleSheet.create({
  wrapper: {
    height: Config.height,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type CPNButtonType = 'theme' | 'warning' | 'success';

interface CPNButtonTypeItem {
  type: CPNButtonType;
  textColor: string;
  backgroundColor: string;
}

interface CPNButtonProps extends TouchableOpacityProps {
  textStyle?: CTextStyle | CTextStyle[];
  /** @default 'theme' */
  type?: CPNButtonType;
  shape?: 'square';
  plain?: boolean;
  isLoading?: boolean;
  disabledSetting?: {
    /**
     * 计时间隔，单位：毫秒
     * @default 1000
     * */
    timeInterval?: number;
    /** 禁用时间，单位：毫秒 */
    timer?: number;
    /**
     * 禁用时的渲染器
     * @param timer - 剩余禁用时间，单位：毫秒
     */
    render?: (timer: number) => React.ReactNode;
    /** 按钮是否初始禁用 */
    initial?: boolean;
  };
}
export function CPNButton(props: Readonly<CPNButtonProps>) {
  const themeColor = useContext(CPNPageViewThemeColor) || Colors.theme;

  const CPNButtonTypeList = useMemo<CPNButtonTypeItem[]>(
    () => [
      {
        type: 'theme',
        textColor: Colors.fontTextReverse,
        backgroundColor: themeColor,
      },
      {
        type: 'warning',
        textColor: Colors.fontText,
        backgroundColor: Colors.warning,
      },
      {
        type: 'success',
        textColor: Colors.fontTextReverse,
        backgroundColor: Colors.success,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      themeColor,
      Colors.fontText,
      Colors.fontTextReverse,
      Colors.warning,
      Colors.success,
    ],
  );

  const [disabledTimer, setDisabledTimer] = useState(
    props.disabledSetting?.initial && props.disabledSetting.timer
      ? props.disabledSetting.timer
      : 0,
  );
  useEffect(() => {
    if (props.disabledSetting?.timer !== undefined && disabledTimer > 0) {
      const timeInterval = props.disabledSetting?.timeInterval ?? 1000;
      const id = setTimeout(() => {
        setDisabledTimer(_disabledTimer => _disabledTimer - timeInterval);
      }, timeInterval);

      return () => {
        clearTimeout(id);
      };
    }
  }, [
    props.disabledSetting?.timer,
    disabledTimer,
    props.disabledSetting?.timeInterval,
  ]);

  const disabled = props.disabled || props.isLoading || disabledTimer > 0;

  function renderDisabled() {
    if (props.disabledSetting?.render) {
      const reactNode = props.disabledSetting.render(disabledTimer);
      return ['string', 'number'].includes(typeof reactNode) ? (
        <CPNText style={props.textStyle}>{reactNode}</CPNText>
      ) : (
        reactNode
      );
    }
  }

  const btnStyle = useMemo<CPNButtonTypeItem>(() => {
    const _btnStyle = CPNButtonTypeList.find(
      _item => _item.type === (props.type ?? 'theme'),
    );
    if (_btnStyle) {
      return _btnStyle;
    }

    return CPNButtonTypeList[0];
  }, [CPNButtonTypeList, props.type]);

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      onPress={_ev => {
        if (props.disabledSetting?.timer !== undefined) {
          setDisabledTimer(props.disabledSetting?.timer);
        }
        props.onPress && props.onPress(_ev);
      }}
      style={[
        styles.wrapper,
        !disabled && StyleGet.boxShadow(),
        {
          paddingVertical: 4,
          paddingHorizontal: 10,
          backgroundColor: props.plain
            ? Colors.backgroundPanel
            : btnStyle.backgroundColor,
          borderColor: btnStyle.backgroundColor,
          borderWidth: 1,
          borderRadius: props.shape === 'square' ? 0 : Config.borderRadius,
          opacity: disabled ? 0.4 : undefined,
        },
        props.style,
      ]}>
      <FontColorContext.Provider
        value={props.plain ? btnStyle.backgroundColor : btnStyle.textColor}>
        {props.isLoading && <RenderActivityIndicator />}

        {(disabled && renderDisabled()) ||
          (['string', 'number'].includes(typeof props.children) ? (
            <CPNText style={props.textStyle}>{props.children}</CPNText>
          ) : (
            props.children
          ))}
      </FontColorContext.Provider>
    </TouchableOpacity>
  );
}

function RenderActivityIndicator() {
  const color = useContext(FontColorContext);
  return (
    <ActivityIndicator size="small" color={color} style={{marginRight: 10}} />
  );
}
