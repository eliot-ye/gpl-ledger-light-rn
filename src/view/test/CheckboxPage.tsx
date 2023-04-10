import React from 'react';
import {View} from 'react-native';
import {CPNButton, CPNCheckbox, CPNPageView, CPNText} from '@components/base';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';

type Props = PageProps<'CheckboxPage'>;
export function CheckboxPage() {
  const nav = useNavigation<Props['navigation']>();

  const [checked, setChecked] = React.useState(true);

  return (
    <CPNPageView
      safeArea={false}
      leftIconType="close"
      titleText="Checkbox Page">
      <View style={{padding: 20}}>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox checked label="選中" />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox checked={false} label="未選中" />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox checked label="選中 disabled" disabled />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox checked={false} disabled label="未選中 disabled" />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox
            checked={checked}
            onPress={() => setChecked(!checked)}
            label="Toggle"
          />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox
            label="Toggle"
            checked={checked}
            onPress={() => setChecked(!checked)}
            shape="round"
          />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox
            label="I acknowledge that my conversion request is subject to approval by Smart Traveler and its Conversion Partners. I have read and accepted the Points Conversion Terms and Conditions."
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox
            label="I acknowledge that my conversion request is subject to approval by Smart Traveler and its Conversion Partners. I have read and accepted the Points Conversion Terms and Conditions."
            verticalCentering={false}
            checked={checked}
            onPress={() => setChecked(!checked)}
          />
        </View>
        <View style={{marginBottom: 10}}>
          <CPNCheckbox checked={checked} onPress={() => setChecked(!checked)}>
            <CPNText>
              I acknowledge that my conversion request is subject to approval by
              Smart Traveler and its Conversion Partners. I have read and
              accepted the Points{' '}
              <CPNText link="https://www.baidu.com">
                Conversion Terms and Conditions
              </CPNText>
              .
            </CPNText>
          </CPNCheckbox>
        </View>
        <CPNButton
          text="go rich text page"
          onPress={() => {
            nav.navigate('TextPage');
          }}
        />
      </View>
    </CPNPageView>
  );
}
