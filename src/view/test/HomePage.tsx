import React from 'react';
import {
  Animated,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {CPNImage, CPNPageView, CPNText} from '@components/base';
import {Colors} from '@/configs/colors';
import type {TabPageProps} from '@/view/Router';
import {StoreRoot} from '@/store';
import {CusLog} from '@/utils/tools';
import {ImageDefaultMap} from '@/assets/images/ImageMap';

const menuList = [
  {title: 'Button & Store', pageName: 'ButtonPage'},
  {title: 'ActionSheet', pageName: 'ActionSheetPage'},
  {title: 'Alert', pageName: 'AlertPage'},
  {title: 'Checkbox', pageName: 'CheckboxPage'},
  {title: 'Text', pageName: 'TextPage'},
  {title: 'RichText', pageName: 'RichTextPage'},
  {title: 'Loading', pageName: 'LoadingPage'},
  {title: 'Picker', pageName: 'PickerPage'},
  {title: 'SwipeItem', pageName: 'SwipeItemPage'},
  {title: 'Toast', pageName: 'ToastPage'},
  {title: 'TestHttp', pageName: 'TestHttpPage'},
  {title: 'Dropdown', pageName: 'DropdownPage'},
  {title: 'PageView', pageName: 'PageViewPage'},
];

let count = 0;

type PageProps = TabPageProps<'HomePage'>;
export function HomePage({navigation}: PageProps) {
  const RootState = StoreRoot.useState();

  count++;
  CusLog.success('HomePageRenderCount:', count);

  const windowDimensions = useWindowDimensions();

  return (
    <CPNPageView
      fixedTop
      hideBack
      renderIOSTopNegativeDistanceView={h => {
        return (
          <Animated.Image
            source={ImageDefaultMap.test1}
            style={{
              width: windowDimensions.width,
              height: Animated.add(h, 260),
            }}
          />
        );
      }}>
      <CPNImage
        source={ImageDefaultMap.test1}
        style={{
          width: windowDimensions.width,
          height: 260,
        }}
      />
      <View style={{flex: 1, padding: 20}}>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <CPNText>theme: {`${RootState.theme}`}</CPNText>
        </View>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <CPNText>langCode: {RootState.langCode}</CPNText>
        </View>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <CPNText>HomePageRenderCount: {count}</CPNText>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundTheme,
            borderRadius: 10,
            padding: 20,
          }}>
          {menuList.map(item => {
            return (
              <TouchableOpacity
                key={item.pageName}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderColor: Colors.dividingLine,
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  navigation.navigate(item.pageName as any);
                }}>
                <CPNText>{item.title}</CPNText>
                <CPNText>{'>>'}</CPNText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </CPNPageView>
  );
}
