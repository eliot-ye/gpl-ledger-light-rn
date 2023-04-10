import React from 'react';
import {View} from 'react-native';
import {CPNButton, CPNPageView, CPNToast} from '@components/base';

let a = 0;
export function ToastPage() {
  return (
    <CPNPageView titleText="Toast Page">
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            a++;
            CPNToast.open({
              text: '交易可获得2倍积分: ' + a,
            });
          }}
        />
      </View>
    </CPNPageView>
  );
}
