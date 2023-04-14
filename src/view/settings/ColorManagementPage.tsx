import React, {useEffect, useState} from 'react';
import {I18n} from '@/assets/I18n';
import {CPNPageView, CPNText} from '@/components/base';
import {dbGetColors} from '@/database';
import {ColorItem} from '@/database/color/schema';
import {View} from 'react-native';
import {CNPCellGroup, CNPCell} from '@/components';
import {Colors} from '@/configs/colors';

export function ColorManagementPage() {
  const [colorList, colorListSet] = useState<ColorItem[]>([]);
  useEffect(() => {
    dbGetColors().then(res => {
      colorListSet(
        res.length
          ? res
          : [
              {id: 'success', name: 'success', value: Colors.success},
              {id: 'warning', name: 'warning', value: Colors.warning},
            ],
      );
    });
  }, []);

  return (
    <CPNPageView titleText={I18n.ColorManagement}>
      <View style={{padding: 20}}>
        <CNPCellGroup>
          {colorList.map((item, index) => (
            <CNPCell
              key={item.id}
              title={
                <>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: item.value,
                      marginRight: 6,
                    }}
                  />
                  <CPNText>{item.name}</CPNText>
                </>
              }
              value={item.value}
              onPress={() => {
                // navigation.navigate('ColorManagementPage');
              }}
              isLast={index === colorList.length - 1}
            />
          ))}
        </CNPCellGroup>
      </View>
    </CPNPageView>
  );
}
