import {CPNPageView, CPNText} from '@/components/base';
import React from 'react';
import {View} from 'react-native';

export function HomePage() {
  return (
    <CPNPageView>
      <View>
        <CPNText>HomePage</CPNText>
      </View>
    </CPNPageView>
  );
}
