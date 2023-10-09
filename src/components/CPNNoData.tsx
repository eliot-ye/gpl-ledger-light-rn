import React, {useContext} from 'react';
import {View} from 'react-native';
import {CPNCellGroupContext, CPNImage, CPNText} from './base';
import {Colors} from '@/configs/colors';
import {I18n} from '@/assets/I18n';
import {StyleGet} from '@/configs/styles';

interface CPNNoDataProps {
  title?: string;
}
export function CPNNoData(props: CPNNoDataProps) {
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
          borderWidth: 0,
          borderBottomWidth: 0.5,
          borderColor: Colors.line,
        },
        !inCellGroup && {
          paddingTop: 100,
        },
      ]}>
      {!inCellGroup && <CPNImage name="NoDataAvailable" size={200} />}
      <CPNText style={{color: Colors.fontSubtitle}}>
        {props.title || I18n.t('NoData')}
      </CPNText>
    </View>
  );
}
