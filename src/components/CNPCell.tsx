import {StyleGet} from '@/configs/styles';
import React, {createContext, useContext} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {CPNIonicons, CPNText, IONName} from './base';
import {Colors} from '@/configs/colors';

export const CNPCellGroupContext = createContext(false);
export const CNPCellConfig = {
  padding: 10,
};

interface CNPCellProps {
  title: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
}
export function CNPCell(props: CNPCellProps) {
  const isCellGroup = useContext(CNPCellGroupContext);

  return (
    <View
      style={[
        StyleGet.cellView(),
        {
          paddingLeft: CNPCellConfig.padding,
          backgroundColor: Colors.backgroundGrey,
          borderWidth: 0.5,
        },
        isCellGroup && {
          paddingLeft: 0,
          backgroundColor: Colors.transparent,
          borderBottomColor: props.isLast
            ? Colors.transparent
            : Colors.dividingLine,
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
        <CPNText style={StyleGet.title('h4')}>{props.title}</CPNText>
        <View
          style={{paddingLeft: CNPCellConfig.padding, flexDirection: 'row'}}>
          {props.value && (
            <CPNText style={{color: Colors.fontSubtitle}}>
              {props.value}
            </CPNText>
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
