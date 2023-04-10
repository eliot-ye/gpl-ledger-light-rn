import React, {useMemo, useRef, useState} from 'react';
import {View} from 'react-native';
import {
  CPNButton,
  CPNPageView,
  CPNDateTimePicker,
  CPNModalPicker,
  CPNToast,
} from '@components/base';
import {
  CPNPickerSingle,
  type DateTimeType,
  type DateTimeTypeObject,
  type PickerData,
} from '@components/base/CPNPicker';
import {Colors} from '@/configs/colors';

export function PickerPage() {
  const pickerData = useRef<PickerData>([
    {
      label: '11 label',
      value: '11',
      children: [
        {
          label: '111 label',
          value: '111',
          children: [
            {label: '1111 label labellabel labellabel', value: '1111'},
            {label: '1112 label', value: '1112'},
            {label: '1113 label', value: '1113'},
          ],
        },
        {
          label: '112 label',
          value: '112',
          children: [
            {label: '1121 label', value: '1121'},
            {label: '1122 label', value: '1122'},
            {label: '1123 label', value: '1123'},
          ],
        },
        {label: '113 label', value: '113'},
      ],
    },
    {
      value: '12',
      children: [
        {label: '121 label', value: '121'},
        {
          label: '122 label',
          value: '122',
          children: [
            {label: '1221 label', value: '1221'},
            {label: '1222 label', value: '1222'},
            {label: '1223 label', value: '1223'},
          ],
        },
        {label: '123 label', value: '123'},
      ],
    },
    {label: '13 label', value: '13'},
    {label: '14 label', value: '14'},
    {label: '15 label', value: '15'},
  ]).current;

  const [showCPNPickerSingleModal, setShowCPNPickerSingleModal] =
    useState(false);
  function renderCPNPickerSingleModal() {
    return (
      <>
        <CPNButton
          text={'show CPNPickerSingleModal'}
          onPress={() => {
            setShowCPNPickerSingleModal(true);
          }}
        />
        <CPNModalPicker
          show={showCPNPickerSingleModal}
          onClose={() => setShowCPNPickerSingleModal(false)}
          dataHierarchy={1}
          data={pickerData}
          onConfirm={(itemList, indexList) => {
            CPNToast.open({
              text: itemList.map(item => item?.label || item?.value).join('-'),
            });
            console.log(itemList, indexList);
          }}
        />
      </>
    );
  }

  const [showCPNPickerModal, setShowCPNPickerModal] = useState(false);
  function renderCPNPickerModal() {
    return (
      <>
        <CPNButton
          text={'show CPNPickerModal'}
          onPress={() => {
            setShowCPNPickerModal(true);
          }}
        />
        <CPNModalPicker
          show={showCPNPickerModal}
          onClose={() => setShowCPNPickerModal(false)}
          dataHierarchy={3}
          data={pickerData}
          columnConfigs={[
            {title: 'title1'},
            {scrollViewStyle: {backgroundColor: '#ccc'}, title: 'title2'},
            {title: 'title3'},
          ]}
          initActiveList={[1, 1]}
          itemHeight={80}
          itemShowNum={3}
          onConfirm={(itemList, indexList) => {
            CPNToast.open({
              text: itemList.map(item => item?.label || item?.value).join('-'),
            });
            console.log(itemList, indexList);
          }}
        />
      </>
    );
  }

  const type = useMemo<(DateTimeTypeObject | DateTimeType)[]>(
    () => [{type: 'year', text: '年'}, 'month', 'date', 'hour', 'minute'],
    [],
  );
  const [showCPNDateTimePickerModal, setShowCPNDateTimePickerModal] =
    useState(false);
  function renderCPNDateTimePickModal() {
    return (
      <>
        <CPNButton
          text={'show CPNDateTimePickerModal'}
          onPress={() => {
            setShowCPNDateTimePickerModal(true);
          }}
        />
        <CPNDateTimePicker
          show={showCPNDateTimePickerModal}
          onClose={() => setShowCPNDateTimePickerModal(false)}
          type={type}
          monthLabel={['一月', undefined, '三月']}
          onConfirm={data => {
            CPNToast.open({
              text: `${data.year}-${data.month}-${data.date} ${data.hour}:${data.minute}:${data.second}`,
            });
            console.log(data);
          }}
        />
      </>
    );
  }

  return (
    <CPNPageView titleText="Picker Page">
      <View style={{padding: 20}}>
        <View style={{backgroundColor: Colors.backgroundTheme}}>
          <CPNPickerSingle data={pickerData} />
        </View>
        <View style={{height: 20}} />
        {renderCPNPickerSingleModal()}
        <View style={{height: 20}} />
        {renderCPNPickerModal()}
        <View style={{height: 20}} />
        {renderCPNDateTimePickModal()}
      </View>
    </CPNPageView>
  );
}
