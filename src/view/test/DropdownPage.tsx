import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {CPNDropdown, CPNPageView} from '@components/base';

export function DropdownPage() {
  const pickerData = useRef([
    {label: '一、无感知验证码实现原理', value: '100'},
    {label: '1、安全用户“点击完成验证”，安全用户验证通过。', value: '111'},
    {
      label:
        '2、风险用户根据风险程度触发二次验证，比如滑动拼图、图片点选等，验证通过之后再允许进行下一步操作。',
      value: '112',
    },
    {label: '无感知验证核心在于判断访问用户否是安全用户：', value: '120'},
    {
      label:
        '需要根据用户行为数据、访问代理、IP、环境变量等等数据建模，用户点击验证按钮之后去后端接口验证，验证通过才可进行下一步操作。',
      value: '121',
    },
    {label: '安全用户判断模型：', value: '130'},
    {
      label:
        '1、用户行为数据：页面停顿时间、点击按钮时长，其他输入事件（埋点）、点击事件（埋点）等等。',
      value: '131',
    },
    {
      label: '2、访问代理：建立白名单机制，非白名单代理触发二次验证。',
      value: '132',
    },
    {
      label: '3、访问IP：白名单机制、黑名单机制、IP规则、vpn判断等等。',
      value: '133',
    },
    {
      label: '4、环境变量：获取用户设备信息、网络信息、操作系统信息等等。',
      value: '134',
    },
  ]).current;

  const [selectItem, selectItemSet] = useState(pickerData[3]);

  return (
    <CPNPageView titleText="Dropdown">
      <View style={{padding: 20}}>
        <CPNDropdown
          numberOfLines={1}
          data={pickerData}
          checked={selectItem.value}
          onSelect={item => {
            selectItemSet(item);
          }}
        />
        <View style={{height: 200}} />
        <CPNDropdown
          data={pickerData}
          checked={selectItem.value}
          onSelect={item => {
            selectItemSet(item);
          }}
          cellStyle={{height: 100}}
        />
        <View style={{height: 200}} />
        <CPNDropdown
          data={pickerData}
          checked={selectItem.value}
          onSelect={item => {
            selectItemSet(item);
          }}
        />
        <View style={{height: 200}} />
        <CPNDropdown
          data={pickerData}
          checked={selectItem.value}
          onSelect={item => {
            selectItemSet(item);
          }}
        />
        <View style={{height: 200}} />
        <CPNDropdown
          data={pickerData}
          checked={selectItem.value}
          onSelect={item => {
            selectItemSet(item);
          }}
        />
      </View>
    </CPNPageView>
  );
}
