import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CPNPageViewThemeColor, CPNText, FormItemContext} from '.';
import {Colors} from '@/configs/colors';

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    // minHeight: StyleGet.cellView().height,
  },
  btnContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.transparent,
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
  props: CPNButtonGroupProps<T>,
) {
  const formItem = useContext(FormItemContext);
  const pageViewThemeColor = useContext(CPNPageViewThemeColor);
  const themeColor = formItem.themeColor || pageViewThemeColor || Colors.theme;

  return (
    <View
      style={[
        styles.groupContainer,
        {borderColor: Colors.theme, backgroundColor: Colors.backgroundPanel},
      ]}>
      {props.buttonList.map((item, index) => (
        <View
          key={item.value}
          style={[
            styles.btnContainer,
            {borderLeftColor: index === 0 ? Colors.transparent : themeColor},
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
