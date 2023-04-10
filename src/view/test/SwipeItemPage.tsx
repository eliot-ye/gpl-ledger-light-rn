import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {CPNButton, CPNPageView, CPNSwipeItem, CPNToast} from '@components/base';
import {Colors} from '@/configs/colors';

export function SwipeItemPage() {
  const [count, countSet] = useState(0);
  return (
    <CPNPageView titleText="SwipeItem Page">
      <View style={{padding: 20}}>
        <CPNSwipeItem
          buttons={useMemo(
            () => [
              {
                text: '按钮1',
                textColor: Colors.fontTextReverse,
                width: 50,
                onPress() {
                  countSet(_ => _ + 1);
                  CPNToast.open({text: 'onPress 按钮1'});
                  console.log('onPress 按钮1');
                },
              },
              {
                text: '按钮2',
                backgroundColor: 'red',
                onPress() {
                  countSet(_ => _ + 1);
                  CPNToast.open({text: 'onPress 按钮2'});
                  console.log('onPress 按钮2');
                },
              },
            ],
            [],
          )}>
          <View style={{padding: 5}}>
            <CPNButton
              text={`test btn ${count}`}
              onPress={() => {
                countSet(_ => _ + 1);
                CPNToast.open({text: 'onPress test btn'});
                console.log('onPress test btn');
              }}
            />
          </View>
        </CPNSwipeItem>
      </View>
    </CPNPageView>
  );
}
