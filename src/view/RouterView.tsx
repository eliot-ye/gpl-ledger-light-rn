import React from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import {
  navigationRef,
  RootStack,
  TabbarStackParamList,
  TabStack,
} from './Router';
import {CPNIonicons, CPNText, IONName} from '@components/base';
import {Colors, ColorsInstance} from '@/configs/colors';
import {View} from 'react-native';
import {LS_UserInfo} from '@/store/localStorage';
import {I18n} from '@/assets/I18n';
import {injectControlJSON} from '@/configs/envControl';
import {envConstant} from '@/configs/env';
import {CusLog} from '@/utils/tools';

import {RTVAuthorization} from './authorization/routes';
import {HomePage, RTVHome} from './ledger/routes';
import {RTVSettings, SettingPage} from './settings/routes';

export function RouterView() {
  async function navReady() {
    try {
      await injectControlJSON();
    } catch (error) {
      CusLog.error('RouterView onReady', 'injectControlJSON', error);
    }

    const infoList = await LS_UserInfo.get();

    if (infoList.length === 0) {
      navigationRef.dispatch(StackActions.replace('SignUpPage'));
    }
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={navReady}
      onStateChange={async () => {
        if (envConstant.CE_OnChangeRoute) {
          try {
            await injectControlJSON();
          } catch (error) {
            CusLog.error(
              'RouterView onStateChange',
              'injectControlJSON',
              error,
            );
          }
        }
      }}>
      <RootStack.Navigator
        initialRouteName={'SignInPage'}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {RTVAuthorization}
        <RootStack.Screen
          name="Tabbar"
          component={TabBarView}
          options={{headerShown: false, animationEnabled: false}}
        />
        {RTVHome}
        {RTVSettings}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TabBarView() {
  I18n.useLocal();
  ColorsInstance.useTheme();

  const tabbarOptionList: TabbarOption[] = [
    {
      name: 'HomePage',
      label: I18n.t('Ledger'),
      icon: IONName.Home,
    },
    {
      name: 'SettingPage',
      label: I18n.t('Settings'),
      icon: IONName.Settings,
    },
  ];

  return (
    <TabStack.Navigator
      screenOptions={({route}) => {
        const opt = tabbarOptionList.find(_item => _item.name === route.name);

        return {
          headerShown: false,
          tabBarActiveTintColor: opt?.textActiveColor || Colors.theme,
          tabBarInactiveTintColor: opt?.textColor || Colors.fontSubtitle,
          tabBarBackground: () =>
            opt?.backgroundColor || (
              <View
                style={{backgroundColor: Colors.backgroundPanel, flex: 1}}
              />
            ),
          tabBarLabel: ({color, focused}) => (
            <CPNText style={{color, fontSize: focused ? 12 : 10}}>
              {opt?.label}
            </CPNText>
          ),
          tabBarIcon: ({color, focused}) => (
            <CPNIonicons
              name={opt?.icon}
              color={color}
              size={focused ? 24 : 20}
            />
          ),
        };
      }}>
      <TabStack.Screen name="HomePage" component={HomePage} />
      <TabStack.Screen name="SettingPage" component={SettingPage} />
    </TabStack.Navigator>
  );
}

interface TabbarOption {
  name: keyof TabbarStackParamList;
  label: string;
  icon: IONName;
  iconActive?: IONName;
  backgroundColor?: React.ReactNode;
  textColor?: string;
  textActiveColor?: string;
}
