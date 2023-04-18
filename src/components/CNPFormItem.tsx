import React, {createContext, useMemo} from 'react';
import {StyleGet} from '@/configs/styles';
import {Colors} from '@/configs/colors';
import {View, ViewProps} from 'react-native';
import {CPNText} from './base';

export const FormItemContext = createContext({
  isFormItem: false,
  hasError: false,
});

interface CNPFormItemProps extends ViewProps {
  title?: React.ReactNode;
  hasError?: boolean;
  errorText?: string;
}
export function CNPFormItem(props: CNPFormItemProps) {
  return (
    <View {...props}>
      {!!props.title && (
        <View style={StyleGet.cellTitleView()}>
          {['string', 'number'].includes(typeof props.title) ? (
            <CPNText
              style={{color: props.hasError ? Colors.fail : Colors.theme}}>
              {props.title}
            </CPNText>
          ) : (
            props.title
          )}
        </View>
      )}
      <View
        style={[
          {height: StyleGet.cellView().height, justifyContent: 'center'},
        ]}>
        <FormItemContext.Provider
          value={useMemo(
            () => ({
              isFormItem: true,
              hasError: props.hasError || false,
            }),
            [props.hasError],
          )}>
          {props.children}
        </FormItemContext.Provider>
      </View>
      {!!props.errorText && (
        <View style={{opacity: props.hasError ? 1 : 0}}>
          <CPNText style={{fontSize: 12, color: Colors.fail}}>
            {props.errorText}
          </CPNText>
        </View>
      )}
    </View>
  );
}
