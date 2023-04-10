import React from 'react';
import {View} from 'react-native';
import {
  CPNActionSheet,
  CPNButton,
  CPNPageView,
  CPNToast,
} from '@components/base';

export function ActionSheetPage() {
  return (
    <CPNPageView titleText="Action Sheet">
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            CPNActionSheet.open({
              title: 'MarketPlace',
              message: 'Choose your MarketPlace',
              buttons: [
                {text: 'Smartaveller     168,000 pts', value: 1},
                {
                  text: 'Maybank     660 pts',
                  value: 2,
                  leftIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_11.png',
                  },
                },
                {
                  text: 'Starbucks     1,060 pts',
                  value: 3,
                  rightIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_321.png',
                  },
                },
              ],
              onPress(data) {
                CPNToast.open({
                  text: `click text: ${data.text}, value: ${data.value}`,
                });
              },
            });
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            CPNActionSheet.open({
              title: 'MarketPlace',
              closeOnClickOverlay: false,
              buttons: [
                {text: 'Smart Traveller     168,000 pts', value: 1},
                {
                  text: 'Maybank     660 pts',
                  value: 2,
                  leftIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_11.png',
                  },
                },
                {
                  text: 'Starbucks     1,060 pts',
                  value: 3,
                  rightIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_321.png',
                  },
                },
              ],
              onPress(data) {
                CPNToast.open({
                  text: `click text: ${data.text}, value: ${data.value}`,
                });
              },
            });
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            CPNActionSheet.open({
              message: 'MarketPlace',
              buttons: [
                {text: 'Smartaveller     168,000 pts', value: 1},
                {
                  text: 'Maybank     660 pts',
                  value: 2,
                  leftIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_11.png',
                  },
                },
                {
                  text: 'Starbucks     1,060 pts',
                  value: 3,
                  rightIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_321.png',
                  },
                },
              ],
              onPress(data) {
                CPNToast.open({
                  text: `click text: ${data.text}, value: ${data.value}`,
                });
              },
            });
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <CPNButton
          text="test button"
          onPress={() => {
            CPNActionSheet.open({
              buttons: [
                {text: 'Smartaveller     168,000 pts', value: 1},
                {
                  text: 'Maybank     660 pts',
                  value: 2,
                  leftIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_11.png',
                  },
                },
                {
                  text: 'Starbucks     1,060 pts',
                  value: 3,
                  rightIcon: {
                    uri: 'https://s3.ap-southeast-1.amazonaws.com/glp-uat-2-bucket/dev-arrture/ProgramIcons/400%20X%20400_321.png',
                  },
                },
              ],
              onPress(data) {
                CPNToast.open({
                  text: `click text: ${data.text}, value: ${data.value}`,
                });
              },
            });
          }}
        />
      </View>
    </CPNPageView>
  );
}
