import {I18n} from '@/assets/I18n';
import {CPNPageView} from '@/components/base';
import React from 'react';
import {View} from 'react-native';

export function ImportBackupPage() {
  I18n.useLocal();

  return (
    <CPNPageView title={I18n.t('ImportBackup')}>
      <View style={{padding: 20}}></View>
    </CPNPageView>
  );
}
