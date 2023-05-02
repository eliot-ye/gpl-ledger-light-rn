import React, {createContext, useContext, useMemo} from 'react';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';
import {View, ViewProps} from 'react-native';
import {CPNPageViewThemeColor, CPNText} from '.';

export const FormItemContext = createContext({
  isFormItem: false,
  hasError: false,
  themeColor: undefined as undefined | string,
  title: '',
});

interface CPNFormItemProps extends ViewProps {
  title?: React.ReactNode;
  titleColor?: string;
  hasError?: boolean;
  errorText?: string;
  description?: React.ReactNode;
}
export function CPNFormItem(props: CPNFormItemProps) {
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor = props.titleColor || pageViewThemeColor || Colors.theme;

  return (
    <View {...props}>
      {!!props.title && (
        <View style={StyleGet.cellTitleView()}>
          {['string', 'number'].includes(typeof props.title) ? (
            <CPNText style={{color: themeColor}}>{props.title}</CPNText>
          ) : (
            props.title
          )}
        </View>
      )}
      <FormItemContext.Provider
        value={useMemo(
          () => ({
            isFormItem: true,
            themeColor,
            hasError: props.hasError || false,
            title: typeof props.title === 'string' ? props.title : '',
          }),
          [props.hasError, props.title, themeColor],
        )}>
        <View
          style={{
            minHeight: StyleGet.cellView().height,
            justifyContent: 'center',
          }}>
          {props.children}
        </View>
      </FormItemContext.Provider>
      {!!props.description &&
        !props.hasError &&
        (['string', 'number'].includes(typeof props.description) ? (
          <CPNText style={{fontSize: 12, opacity: 0.6}}>
            {props.description}
          </CPNText>
        ) : (
          props.description
        ))}
      {!!props.errorText && props.hasError && (
        <CPNText style={{fontSize: 12, color: Colors.fail}}>
          {props.errorText}
        </CPNText>
      )}
    </View>
  );
}
