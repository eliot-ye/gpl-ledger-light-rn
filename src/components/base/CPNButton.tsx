import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {CPNText, CPNTextColorContext} from './CPNText';
import {Colors} from '@/configs/colors';
import {StyleGet} from '@/configs/styles';
import {CPNPageViewThemeColor} from './CPNPageView';

const Config = {
  height: 60,
  borderRadius: 30,
} as const;

const styles = StyleSheet.create({
  wrapper: {
    height: Config.height,
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
  textStyle?: StyleProp<TextStyle>;
  type?: CPNButtonType;
  shape?: 'square';
  plain?: boolean;
  /** 点击按钮后的禁用时间。单位：秒 */
  disabledTimer?: number;
  /** 禁用时的按钮文本。文本中的 `{timer}` 会被替换为倒计时数字 */
  disabledText?: string;
  /** 按钮是否初始禁用 */
  disabledInit?: boolean;
}
export function CPNButton(props: CPNButtonProps) {
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

  const [disabledTimer, disabledTimerSet] = useState(
    props.disabledInit && props.disabledTimer ? props.disabledTimer : 0,
  );
  useEffect(() => {
    if (props.disabledTimer !== undefined && disabledTimer) {
      const id = setTimeout(() => {
        disabledTimerSet(_disabledTimer => _disabledTimer - 1);
      }, 1000);

      return () => {
        clearTimeout(id);
      };
    }
  }, [props.disabledTimer, disabledTimer]);

  const disabled = props.disabled || disabledTimer > 0;

  const btnStyle = useMemo(() => {
    if (props.disabled) {
      return {
        textColor: Colors.fontTextReverse,
        backgroundColor: Colors.backgroundDisabled,
      };
    }

    const _btnStyle = CPNButtonTypeList.find(
      _item => _item.type === (props.type || 'theme'),
    );
    if (_btnStyle) {
      return _btnStyle;
    }

    return {
      textColor: Colors.fontTextReverse,
      backgroundColor: themeColor,
    };
  }, [CPNButtonTypeList, props.disabled, props.type, themeColor]);

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      onPress={_ev => {
        if (props.disabledTimer !== undefined) {
          disabledTimerSet(props.disabledTimer);
        }
        props.onPress && props.onPress(_ev);
      }}
      style={[
        styles.wrapper,
        StyleGet.boxShadow(),
        {
          backgroundColor: props.plain
            ? Colors.backgroundPanel
            : btnStyle.backgroundColor,
          borderColor: btnStyle.backgroundColor,
          borderWidth: 1,
          borderRadius: props.shape === 'square' ? 0 : Config.borderRadius,
          opacity: disabled ? 0.6 : undefined,
        },
        props.style,
      ]}>
      <CPNTextColorContext.Provider
        value={props.plain ? btnStyle.backgroundColor : btnStyle.textColor}>
        {disabled && props.disabledText ? (
          <CPNText style={[props.textStyle]}>
            {props.disabledText?.replace('{timer}', String(disabledTimer))}
          </CPNText>
        ) : ['string', 'number'].includes(typeof props.children) ? (
          <CPNText style={[props.textStyle]}>{props.children}</CPNText>
        ) : (
          props.children
        )}
      </CPNTextColorContext.Provider>
    </TouchableOpacity>
  );
}
