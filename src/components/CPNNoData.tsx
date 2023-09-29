import React, {useContext} from 'react';
import {View} from 'react-native';
import {CPNCellGroupContext, CPNText} from './base';
import {Colors} from '@/configs/colors';
import {I18n} from '@/assets/I18n';
import {StyleGet} from '@/configs/styles';

interface CPNNoDataProps {
  height?: number;
}
export function CPNNoData(props: CPNNoDataProps) {
  const isCellGroup = useContext(CPNCellGroupContext);
  return (
    <View
      style={[
        {
          height: props.height || 200,
          justifyContent: 'center',
          alignItems: 'center',
        },
        isCellGroup && {
          ...StyleGet.cellView(),
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: Colors.line,
        },
      ]}>
      <CPNText style={{color: Colors.fontSubtitle}}>{I18n.t('NoData')}</CPNText>
    </View>
  );
}
