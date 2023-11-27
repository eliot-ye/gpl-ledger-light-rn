import React from 'react';
import {View} from 'react-native';
import {CPNText} from './base';

interface CPNCurrencyViewProps {
  symbol: string;
  amount: string | number;
}

export function CPNCurrencyView(props: CPNCurrencyViewProps) {
  return (
    <View style={{flexDirection: 'row'}}>
      <CPNText style={{width: 16, textAlign: 'center'}}>{props.symbol}</CPNText>
      <CPNText>{props.amount}</CPNText>
    </View>
  );
}
