import {I18n} from '@/assets/I18n';
import {CPNPageView} from '@/components/base';
import React from 'react';
import {View} from 'react-native';

export function ImportBackupPage() {
  return (
    <CPNPageView title={I18n.ImportBackup}>
      <View style={{padding: 20}}></View>
    </CPNPageView>
  );
}
