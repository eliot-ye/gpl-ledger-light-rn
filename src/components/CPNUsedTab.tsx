import {I18n} from '@/assets/I18n';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNText} from './base';
import {Colors} from '@/configs/colors';

const styles = StyleSheet.create({
  groupContainer: {flexDirection: 'row', borderRadius: 6, borderWidth: 1},
  btnContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
});

export type ShowTabType = 'All' | 'Used' | 'NotUsed';

interface CPNUsedTabProps {
  value: ShowTabType;
  onChange: (type: ShowTabType) => void;
}
export function CPNUsedTab(props: CPNUsedTabProps) {
  return (
    <View
      style={[
        styles.groupContainer,
        {borderColor: Colors.theme, backgroundColor: Colors.backgroundPanel},
      ]}>
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {borderRightColor: Colors.theme},
          props.value === 'All' && {backgroundColor: Colors.theme},
        ]}
        onPress={() => props.onChange('All')}>
        <CPNText
          style={[props.value === 'All' && {color: Colors.fontTextReverse}]}>
          {I18n.All}
        </CPNText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btnContainer,
          {borderRightColor: Colors.theme},
          props.value === 'NotUsed' && {backgroundColor: Colors.theme},
        ]}
        onPress={() => props.onChange('NotUsed')}>
        <CPNText
          style={[
            props.value === 'NotUsed' && {color: Colors.fontTextReverse},
          ]}>
          {I18n.NotUsed}
        </CPNText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btnContainer,
          props.value === 'Used' && {backgroundColor: Colors.theme},
        ]}
        onPress={() => props.onChange('Used')}>
        <CPNText
          style={[props.value === 'Used' && {color: Colors.fontTextReverse}]}>
          {I18n.Used}
        </CPNText>
      </TouchableOpacity>
    </View>
  );
}
