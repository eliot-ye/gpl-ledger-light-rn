import {StyleGet} from '@/configs/styles';
import React, {createContext} from 'react';
import {View, ViewProps} from 'react-native';
import {Colors, ColorsInstance} from '@/configs/colors';

export const CPNCellGroupContext = createContext(false);

export const CPNCellConfig = {
  padding: 10,
} as const;

interface CPNCellGroupProps extends ViewProps {}
export function CPNCellGroup(props: CPNCellGroupProps) {
  ColorsInstance.useCode();

  return (
    <View
      {...props}
      style={[
        StyleGet.boxShadow(),
        {
          paddingLeft: CPNCellConfig.padding,
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 10,
        },
        props.style,
      ]}>
      <CPNCellGroupContext.Provider value={true}>
        {props.children}
      </CPNCellGroupContext.Provider>
    </View>
  );
}
