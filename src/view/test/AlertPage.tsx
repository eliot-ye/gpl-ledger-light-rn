import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {
  CPNAlert,
  CPNAlertView,
  CPNButton,
  CPNPageView,
  CPNToast,
} from '@components/base';

let a = 0;
export function AlertPage() {
  const [showAlert, showAlertSet] = useState(false);
  function renderAlertView() {
    return (
      <View style={{padding: 20}}>
        <CPNButton
          text="CPNAlertView"
          onPress={() => {
            showAlertSet(true);
          }}
        />
        <CPNAlertView
          show={showAlert}
          onClose={() => showAlertSet(false)}
          message="CPNAlertView"
        />
      </View>
    );
  }
  return (
    <CPNPageView titleText="Alert Page">
      {renderAlertView()}
      <View style={{padding: 20}}>
        <CPNButton
          text="native Alert"
          onPress={() => {
            a++;
            Alert.alert(
              '',
              '在您的生日月份，符合条件的交易可获得2倍积分: ' + (a + 3),
              [
                {text: 'ca'},
                {
                  text: 'add',
                  onPress() {
                    Alert.alert(
                      '在您的生日月份，符合条件的交易可获得2倍积分: ' + (a + 3),
                    );
                  },
                },
              ],
            );
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            a++;
            CPNAlert.open({
              // title: '123: ' + (a + 3),
              message:
                '在您的生日月份，符合条件的交易可获得2倍积分: ' + (a + 3),
            });
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            a++;
            CPNAlert.open({
              // title: '123: ' + (a + 3),
              message:
                '在您的生日月份，符合条件的交易可获得2倍积分: ' + (a + 3),
              buttons: [
                {
                  text: 'cancel',
                  onPress: () => {
                    CPNToast.open({text: 'click cancel'});
                  },
                },
                {
                  text: 'ok',
                  onPress: () => {
                    CPNToast.open({text: 'click ok'});
                  },
                },
              ],
            });
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            a++;
            CPNAlert.open({
              title: '在您的生日月份: ' + (a + 1),
              message:
                '在您的生日月份，符合条件的交易可获得2倍积分: ' + (a + 1),
              buttons: [
                {
                  text: 'add',
                  keep: true,
                  onPress: () => {
                    CPNAlert.open({
                      title:
                        '在您的生日月份，符合条件的交易可获得2倍积分: ' +
                        (a + 2),
                      // message: '456: ' + (a + 2),
                      backButtonClose: false,
                      buttons: [
                        {text: 'del'},
                        {
                          text: 'add',
                          keep: true,
                          onPress: () => {
                            CPNAlert.open({
                              // title: '123: ' + (a + 3),
                              message:
                                '在您的生日月份，符合条件的交易可获得2倍积分: ' +
                                (a + 3),
                            });
                          },
                        },
                      ],
                    });
                  },
                },
                {text: 'del'},
                {backgroundColor: '#ccc', text: 'del'},
              ],
            });
          }}
        />
      </View>
    </CPNPageView>
  );
}
