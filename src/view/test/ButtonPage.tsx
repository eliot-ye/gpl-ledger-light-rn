import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {CPNButton, CPNPageView, CPNText} from '@components/base';
import {Colors} from '@/configs/colors';
import {PageProps} from '@/view/Router';
import {StoreExample} from '@/store';

type Props = PageProps<'ButtonPage'>;
export function ButtonPage() {
  const nav = useNavigation<Props['navigation']>();

  const ExampleState = StoreExample.useState();
  const ExampleDispatch = StoreExample.useDispatch();
  return (
    <CPNPageView titleText="Button Page">
      <View style={{padding: 20}}>
        <CPNButton
          style={{marginBottom: 10}}
          onPress={() => {
            ExampleDispatch('reset');
          }}>
          <CPNText style={{color: Colors.fontTextReverse}}>reset</CPNText>
        </CPNButton>
      </View>
      <View style={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <CPNText>store count: {ExampleState.count}</CPNText>
        </View>
        <CPNButton
          disabledTimer={5}
          disabledInit
          disabledText="{timer}s 后可用"
          text="count ++"
          type="success"
          style={{marginBottom: 10}}
          onPress={() => {
            ExampleDispatch('count', ExampleState.count + 1);
          }}
        />
        <CPNButton
          disabledTimer={5}
          disabledText="{timer}s 后可用"
          text="count --"
          type="warning"
          style={{marginBottom: 10}}
          onPress={() => {
            ExampleDispatch('count', ExampleState.count - 1);
          }}
        />
      </View>
      <View style={{padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <CPNText>store count2: {ExampleState.count2}</CPNText>
        </View>
        <CPNButton
          text="count2 ++"
          type="success"
          style={{marginBottom: 10}}
          onPress={() => {
            ExampleDispatch('count2', ExampleState.count2 + 1);
          }}
        />
        <CPNButton
          text="count2 --"
          type="warning"
          style={{marginBottom: 10}}
          onPress={() => {
            ExampleDispatch('count2', ExampleState.count2 - 1);
          }}
        />

        <CPNButton
          text="go to about page"
          shape="square"
          style={{marginBottom: 10}}
          onPress={() => {
            nav.navigate('Tabbar', {screen: 'AboutPage'});
          }}
        />

        <CPNButton
          disabled
          text="disabled button"
          style={{marginBottom: 10}}
          onPress={() => {
            nav.navigate('Tabbar', {screen: 'AboutPage'});
          }}
        />
      </View>
    </CPNPageView>
  );
}
