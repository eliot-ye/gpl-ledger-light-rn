import {I18n} from '@/assets/I18n';
import {CNPCell, CNPCellGroup} from '@/components';
import {CPNPageView} from '@/components/base';
import {Colors} from '@/configs/colors';
import React from 'react';
import {View} from 'react-native';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';

export function SettingPage() {
  const navigation = useNavigation<PageProps<'Tabbar'>['navigation']>();

  return (
    <CPNPageView
      titleText={I18n.Settings}
      headerBackgroundColor={Colors.warning}
      hideBack>
      <View style={{padding: 20}}>
        <CNPCellGroup>
          <CNPCell
            title={I18n.ColorManagement}
            onPress={() => {
              navigation.navigate('ColorManagementPage');
            }}
          />
          <CNPCell
            title="颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理"
            value="valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue"
            onPress={() => {
              navigation.navigate('ColorManagementPage');
            }}
          />
          <CNPCell
            title="颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理"
            value="valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue"
            isLast
          />
        </CNPCellGroup>
      </View>
      <View style={{padding: 20}}>
        <CNPCell
          title="颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理颜色管理"
          value="valuevaluevaluevaluevaluevaluevaluevaluevaluevaluevaluevalue"
          isLast
        />
      </View>
    </CPNPageView>
  );
}
