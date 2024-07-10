import {StyleGet} from '@/assets/styles';
import React, {useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  CPNCellConfig,
  CPNCellGroupContext,
  CPNIonicons,
  CPNText,
  FontColorContext,
  FontSizeContext,
  IONName,
} from '.';
import {Colors, ColorsInstance} from '@/assets/colors';

interface CPNCellProps {
  title: React.ReactNode;
  value?: React.ReactNode;
  isLast?: boolean;
  onPress?: () => void;
  /** @default true */
  showChevron?: boolean;
  rightIcon?: React.ReactElement;
}
export function CPNCell(props: Readonly<CPNCellProps>) {
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
        <FontSizeContext.Provider value={StyleGet.title('h4').fontSize}>
          <FontColorContext.Provider value={StyleGet.title('h4').color}>
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
          </FontColorContext.Provider>
        </FontSizeContext.Provider>
        <View
          style={{
            flex: 1,
            paddingHorizontal: CPNCellConfig.padding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          {props.value && (
            <FontColorContext.Provider value={Colors.fontSubtitle}>
              {['string', 'number'].includes(typeof props.value) ? (
                <CPNText>{props.value}</CPNText>
              ) : (
                props.value
              )}
            </FontColorContext.Provider>
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
