import {CNPCell, CNPCellGroup} from '@/components';
import {CPNPageView} from '@/components/base';
import {Colors} from '@/configs/colors';
import React from 'react';
import {View} from 'react-native';

export function SettingPage() {
  return (
    <CPNPageView
      titleText="设置"
      headerBackgroundColor={Colors.warning}
      hideBack>
      <View style={{padding: 20}}>
        <CNPCellGroup>
          <CNPCell title="颜色管理" onPress={() => {}} />
          <CNPCell title="颜色管理" />
          <CNPCell title="颜色管理" isLast />
        </CNPCellGroup>
      </View>
    </CPNPageView>
  );
}
