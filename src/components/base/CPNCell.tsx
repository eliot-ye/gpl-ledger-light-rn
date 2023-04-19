import {StyleGet} from '@/configs/styles';
import React, {createContext, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  CPNIonicons,
  CPNText,
  CPNTextColorContext,
  CPNTextFontSizeContext,
  IONName,
} from '.';
import {Colors} from '@/configs/colors';

export const CPNCellGroupContext = createContext(false);
export const CPNCellConfig = {
  padding: 10,
} as const;

interface CPNCellProps {
  title: React.ReactNode;
  value?: React.ReactNode;
  isLast?: boolean;
  onPress?: () => void;
}
export function CPNCell(props: CPNCellProps) {
  const isCellGroup = useContext(CPNCellGroupContext);

  return (
    <View
      style={[
        StyleGet.cellView(),
        {
          paddingRight: 0,
          backgroundColor: Colors.backgroundPanel,
          borderWidth: 0.5,
        },
        isCellGroup && {
          paddingLeft: 0,
          backgroundColor: Colors.transparent,
          borderBottomColor: props.isLast ? Colors.transparent : Colors.line,
        },
      ]}>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        disabled={!props.onPress}
        onPress={props.onPress}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 2.5,
          }}>
          <CPNTextFontSizeContext.Provider
            value={StyleGet.title('h4').fontSize}>
            <CPNTextColorContext.Provider value={StyleGet.title('h4').color}>
              {['string', 'number'].includes(typeof props.title) ? (
                <CPNText>{props.title}</CPNText>
              ) : (
                props.title
              )}
            </CPNTextColorContext.Provider>
          </CPNTextFontSizeContext.Provider>
        </View>
        <View
          style={{
            paddingHorizontal: CPNCellConfig.padding,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            maxWidth: '50%',
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
          {props.onPress && (
            <CPNIonicons
              name={IONName.ChevronForward}
              color={Colors.fontSubtitle}
              size={20}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
