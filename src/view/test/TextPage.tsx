import React from 'react';
import {View} from 'react-native';
import {CPNButton, CPNPageView, CPNText} from '@components/base';
import {PageProps} from '../Router';
import {useNavigation} from '@react-navigation/native';

type Props = PageProps<'TextPage'>;
export function TextPage() {
  const nav = useNavigation<Props['navigation']>();
  return (
    <CPNPageView safeArea={false} leftIconType="close" titleText="Text Page">
      <View style={{flex: 1, padding: 20}}>
        <CPNText style={{marginBottom: 10}}>
          https://dplink.arrture.com/open-page/WebviewPage?paramkey=source-title&source=https://uatmember.mysmarttraveller.com/privacy-policy&title=Privacy
          Policy
        </CPNText>
        <CPNText
          style={{marginBottom: 10}}
          link="https://dplink.arrture.com/open-page/Tabbar?paramkey=screen&screen=MenuPage">
          https://dplink.arrture.com/open-page/Tabbar?paramkey=screen&screen=MenuPage
        </CPNText>
        <CPNButton
          text="go rich text page"
          onPress={() => {
            nav.navigate('RichTextPage');
          }}
        />
      </View>
    </CPNPageView>
  );
}
