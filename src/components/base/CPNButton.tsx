import React, {useEffect, useMemo, useState} from 'react';
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

const Config = {
  height: 60,
  borderRadius: 30,
} as const;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleGet.boxShadow(),
    height: Config.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {textAlign: 'center'},
});

export type CPNButtonType = 'theme' | 'warning' | 'success';

interface CPNButtonTypeItem {
  type: CPNButtonType;
  textColor: string;
  backgroundColor: string;
}

interface CPNButtonProps extends TouchableOpacityProps {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  type?: CPNButtonType;
  shape?: 'square';
  /** 点击按钮后的禁用时间。单位：秒 */
  disabledTimer?: number;
  /** 禁用时的按钮文本。文本中的 `{timer}` 会被替换为倒计时数字 */
  disabledText?: string;
  /** 按钮是否初始禁用 */
  disabledInit?: boolean;
}
export function CPNButton(props: CPNButtonProps) {
  const CPNButtonTypeList = useMemo<CPNButtonTypeItem[]>(
    () => [
      {
        type: 'theme',
        textColor: Colors.fontTextReverse,
        backgroundColor: Colors.theme,
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
      Colors.fontText,
      Colors.fontTextReverse,
      Colors.theme,
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

  const disabled = disabledTimer > 0;

  const btnStyle = useMemo(() => {
    if (disabled || props.disabled) {
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
      backgroundColor: Colors.theme,
    };
  }, [CPNButtonTypeList, disabled, props.disabled, props.type]);

  return (
    <TouchableOpacity
      disabled={disabled}
      {...props}
      onPress={_ev => {
        if (props.disabledTimer !== undefined) {
          disabledTimerSet(props.disabledTimer);
        }
        props.onPress && props.onPress(_ev);
      }}
      style={[
        styles.wrapper,
        {
          shadowOpacity: 0.7,
          backgroundColor: btnStyle.backgroundColor,
          borderRadius: props.shape === 'square' ? 0 : Config.borderRadius,
        },
        props.style,
      ]}>
      <CPNTextColorContext.Provider value={btnStyle.textColor}>
        {props.children || (
          <CPNText style={[styles.text, props.textStyle]}>
            {disabled
              ? props.disabledText?.replace('{timer}', String(disabledTimer)) ||
                props.text
              : props.text}
          </CPNText>
        )}
      </CPNTextColorContext.Provider>
    </TouchableOpacity>
  );
}
