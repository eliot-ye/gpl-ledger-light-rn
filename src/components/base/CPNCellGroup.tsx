import {StyleGet} from '@/configs/styles';
import React from 'react';
import {View, ViewProps} from 'react-native';
import {CPNCellConfig, CPNCellGroupContext} from './CPNCell';
import {Colors, ColorsInstance} from '@/configs/colors';

interface CPNCellGroupProps extends ViewProps {}
export function CPNCellGroup(props: CPNCellGroupProps) {
  ColorsInstance.useTheme();

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
