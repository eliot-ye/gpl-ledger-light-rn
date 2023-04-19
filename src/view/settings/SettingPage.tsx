import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNCell, CPNCellGroup} from '@/components/base';
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
        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.ColorManagement}
            onPress={() => {
              navigation.navigate('ColorManagementPage');
            }}
          />
          <CPNCell
            title={I18n.CurrencyManagement}
            onPress={() => {
              navigation.navigate('CurrencyManagementPage');
            }}
          />
          <CPNCell
            title={I18n.AssetTypeManagement}
            onPress={() => {
              navigation.navigate('AssetTypeManagementPage');
            }}
            isLast
          />
        </CPNCellGroup>

        <CPNCellGroup style={{marginBottom: 20}}>
          <CPNCell
            title={I18n.ColorManagement}
            onPress={() => {
              navigation.navigate('CurrencyManagementPage');
            }}
            isLast
          />
        </CPNCellGroup>
      </View>
    </CPNPageView>
  );
}
