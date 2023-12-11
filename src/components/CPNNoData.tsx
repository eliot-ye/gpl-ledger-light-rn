import React, {useContext} from 'react';
import {View} from 'react-native';
import {CPNCellConfig, CPNCellGroupContext, CPNImage, CPNText} from './base';
import {Colors, ColorsInstance} from '@/configs/colors';
import {I18n} from '@/assets/I18n';
import {StyleGet} from '@/configs/styles';

interface CPNNoDataProps {
  title?: string;
}
export function CPNNoData(props: CPNNoDataProps) {
  I18n.useLocal();
  ColorsInstance.useTheme();

  const inCellGroup = useContext(CPNCellGroupContext);

  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
        inCellGroup && {
          ...StyleGet.cellView(),
          borderBottomWidth: 0.5,
          borderColor: Colors.line,
          paddingBottom: 50,
          marginRight: CPNCellConfig.padding,
        },
        !inCellGroup && {
          paddingTop: 100,
        },
      ]}>
      <CPNImage name="NoDataAvailable" size={200} />
      <CPNText style={{color: Colors.fontSubtitle}}>
        {props.title || I18n.t('NoData')}
      </CPNText>
    </View>
  );
}
