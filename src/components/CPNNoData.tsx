import React, {useContext} from 'react';
import {View} from 'react-native';
import {CPNCellConfig, CPNCellGroupContext, CPNImage, CPNText} from './base';
import {Colors, ColorsInstance} from '@/assets/colors';
import {I18n} from '@/assets/I18n';
import {StyleGet} from '@/assets/styles';

interface CPNNoDataProps {
  title?: string;
  isLoading?: boolean;
}
export function CPNNoData(props: CPNNoDataProps) {
  I18n.useLangCode();
  ColorsInstance.useCode();

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
        {props.title ||
          (props.isLoading ? I18n.t('Loading') : I18n.t('NoDataTip'))}
      </CPNText>
    </View>
  );
}
