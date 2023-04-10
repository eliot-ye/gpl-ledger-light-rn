import React from 'react';
import {View} from 'react-native';
import {CPNButton, CPNLoading, CPNPageView} from '@components/base';

export function LoadingPage() {
  return (
    <CPNPageView titleText="Loading Page">
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            CPNLoading.open();
            setTimeout(() => {
              CPNLoading.close();
            }, 3000);
          }}
        />
      </View>
    </CPNPageView>
  );
}
