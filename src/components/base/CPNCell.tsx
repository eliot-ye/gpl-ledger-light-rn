import {StyleGet} from '@/configs/styles';
import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  CPNCellConfig,
  CPNCellGroupContext,
  CPNIonicons,
  CPNText,
  CPNTextColorContext,
  CPNTextFontSizeContext,
  IONName,
} from '.';
import {Colors, ColorsInstance} from '@/configs/colors';

interface CPNCellProps {
  title: React.ReactNode;
  value?: React.ReactNode;
  isLast?: boolean;
  onPress?: () => void;
  /** @default true */
  showChevron?: boolean;
  rightIcon?: React.ReactElement;
}
export function CPNCell(props: CPNCellProps) {
  const inCellGroup = useContext(CPNCellGroupContext);
  ColorsInstance.useCode();

  return (
    <View
      style={[
        StyleGet.cellView(),
        {
          paddingRight: 0,
          backgroundColor: Colors.backgroundPanel,
        },
        inCellGroup && {
          paddingLeft: 0,
          backgroundColor: Colors.transparent,
          borderBottomWidth: props.isLast ? 0 : 0.5,
        },
      ]}>
      <TouchableOpacity
        accessible
        accessibilityRole="list"
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        disabled={!props.onPress}
        onPress={props.onPress}>
        <CPNTextFontSizeContext.Provider value={StyleGet.title('h4').fontSize}>
          <CPNTextColorContext.Provider value={StyleGet.title('h4').color}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 2.5,
                minWidth: '20%',
                maxWidth: '40%',
                marginRight: 10,
              }}>
              {['string', 'number'].includes(typeof props.title) ? (
                <CPNText>{props.title}</CPNText>
              ) : (
                props.title
              )}
            </View>
          </CPNTextColorContext.Provider>
        </CPNTextFontSizeContext.Provider>
        <View
          style={{
            flex: 1,
            paddingHorizontal: CPNCellConfig.padding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {props.value && (
            <CPNTextColorContext.Provider value={Colors.fontSubtitle}>
              {['string', 'number'].includes(typeof props.value) ? (
                <CPNText>{props.value}</CPNText>
              ) : (
                props.value
              )}
            </CPNTextColorContext.Provider>
          )}
          {props.rightIcon ||
            (props.showChevron !== false && props.onPress && (
              <CPNIonicons
                name={IONName.ChevronForward}
                color={Colors.fontSubtitle}
                size={20}
              />
            ))}
        </View>
      </TouchableOpacity>
    </View>
  );
}
