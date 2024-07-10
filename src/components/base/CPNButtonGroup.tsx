import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNPageViewThemeColor, CPNText, FormItemContext} from '.';
import {Colors} from '@/assets/colors';
import {StyleGet} from '@/assets/styles';

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
  },
  btnContainer: {
    flex: 1,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface ButtonList<T> {
  text: string;
  value: T;
}
interface CPNButtonGroupProps<T> {
  buttonList: ButtonList<T>[];
  value?: T;
  onPress?: (type: T) => void;
}
export function CPNButtonGroup<T extends string | number>(
  props: Readonly<CPNButtonGroupProps<T>>,
) {
  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor =
    (formItem.themeColor ?? pageViewThemeColor) || Colors.theme;

  return (
    <View
      style={[
        StyleGet.boxShadow(),
        styles.groupContainer,
        {
          borderColor: themeColor,
          backgroundColor: Colors.backgroundPanel,
        },
      ]}>
      {props.buttonList.map((item, index) => (
        <View
          key={item.value}
          style={[
            styles.btnContainer,
            {borderColor: themeColor, borderLeftWidth: index === 0 ? 0 : 1},
            props.value === item.value && {backgroundColor: themeColor},
          ]}>
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => props.onPress && props.onPress(item.value)}>
            <CPNText
              style={[
                props.value === item.value && {color: Colors.fontTextReverse},
              ]}>
              {item.text || item.value}
            </CPNText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
