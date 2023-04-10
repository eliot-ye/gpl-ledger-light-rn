import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import {CPNButton, CPNPageView, CPNText} from '@components/base';
import {BarTextStyle} from '@components/base/CPNPageView';
import {Colors, ThemeCode} from '@/configs/colors';
import {TabPageProps} from '../Router';
import {I18n, LangCode} from '@assets/I18n';
import {StoreExample, StoreRoot} from '@/store';
import {LS_Lang, LS_Theme, LS_Token} from '@/store/localStorage';
import CusI18n from '@/libs/CreateI18n';

type PageProps = TabPageProps<'AboutPage'>;
export function AboutPage() {
  const navigation = useNavigation<PageProps['navigation']>();
  useEffect(() => {
    return navigation.addListener('tabPress', () => {
      console.log('tabPress', navigation.isFocused());
    });
  }, [navigation]);

  const RootState = StoreRoot.useState();
  const RootDispatch = StoreRoot.useDispatch();

  const langCode =
    RootState.langCode === LangCode.zhHans ? LangCode.en : LangCode.zhHans;
  const themeCode =
    RootState.theme === ThemeCode.default ? ThemeCode.dark : ThemeCode.default;

  const ExampleState = StoreExample.useState();
  const ExampleDispatch = StoreExample.useDispatch();

  return (
    <CPNPageView
      hideBack
      titleText="About"
      barStyle={BarTextStyle.light}
      headerBackgroundColor={Colors.warning}
      style={{backgroundColor: Colors.backgroundGrey}}>
      <View style={{padding: 20}}>
        <View style={{marginBottom: 10}}>
          <View style={{alignItems: 'center'}}>
            <CPNText>store count: {ExampleState.count}</CPNText>
            <CPNText>store count2: {ExampleState.count2}</CPNText>
          </View>
          <CPNButton
            text="go store page"
            style={{marginBottom: 10}}
            onPress={() => {
              navigation.navigate('ButtonPage');
            }}
          />
          <CPNButton
            text="reset"
            style={{marginBottom: 10}}
            onPress={() => {
              ExampleDispatch('reset');
            }}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <View style={{alignItems: 'center'}}>
            <CPNText>
              {CusI18n.formatReactText(
                I18n.test1,
                <CPNText link="https://www.baidu.com">baidu</CPNText>,
              )}
            </CPNText>
            <CPNText>{I18n.formatString(I18n.test2, {a: 404})}</CPNText>
          </View>
          <CPNButton
            text={`change lang: ${langCode}`}
            onPress={() => {
              LS_Lang.set(langCode);
              RootDispatch('langCode', langCode);
            }}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <CPNButton
            text={`change theme: ${themeCode}`}
            onPress={() => {
              LS_Theme.set(themeCode);
              RootDispatch('theme', themeCode);
            }}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <CPNButton
            text="go home"
            onPress={() => {
              navigation.navigate('HomePage');
            }}
          />
        </View>

        <View style={{marginBottom: 10}}>
          <CPNButton
            text="SignOut"
            onPress={async () => {
              await LS_Token.remove();
              RootDispatch('isSignIn', false);
            }}
          />
        </View>
      </View>
    </CPNPageView>
  );
}
