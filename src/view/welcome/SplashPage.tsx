import React from 'react';
import {CPNImage} from '@/components/base';
import {View, useWindowDimensions} from 'react-native';
import {Colors} from '@/configs/colors';

export function SplashPage() {
  const {width} = useWindowDimensions();
  const logoSize = (width / 3) * 2;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.theme,
      }}>
      <CPNImage name="logoWhite" size={logoSize} />
    </View>
  );
}
