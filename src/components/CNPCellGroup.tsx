import {StyleGet} from '@/configs/styles';
import React from 'react';
import {View, ViewProps} from 'react-native';
import {CNPCellConfig, CNPCellGroupContext} from './CNPCell';
import {Colors} from '@/configs/colors';

interface CNPCellGroupProps extends ViewProps {}
export function CNPCellGroup(props: CNPCellGroupProps) {
  return (
    <View
      {...props}
      style={[
        StyleGet.boxShadow(),
        {
          paddingLeft: CNPCellConfig.padding,
          backgroundColor: Colors.backgroundPanel,
          borderRadius: 10,
        },
        props.style,
      ]}>
      <CNPCellGroupContext.Provider value={true}>
        {props.children}
      </CNPCellGroupContext.Provider>
    </View>
  );
}
