import {Colors} from '@/assets/colors';
import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {CPNText} from './base';
import {I18n} from '@/assets/I18n';

const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.line,
  },
});

export function CPNDivisionLine(props: ViewProps) {
  I18n.useLangCode();

  return (
    <View
      {...props}
      style={[
        {flexDirection: 'row', alignItems: 'center', marginVertical: 6},
        props.style,
      ]}>
      <View style={styles.line} />
      <CPNText
        style={{
          marginHorizontal: 10,
          fontSize: 12,
          color: Colors.fontSubtitle,
        }}>
        {props.children || I18n.t('OR')}
      </CPNText>
      <View style={styles.line} />
    </View>
  );
}
