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
import {Colors} from '@/configs/colors';
import {Platform} from 'react-native';
import {LS_UserInfo} from '@/store/localStorage';
import {I18n} from '@/assets/I18n';

import {renderAuthorizationRouterView} from './authorization/routes';
import {HomePage, renderHomeRouterView} from './ledger/routes';
import {renderSettingsRouterView, SettingPage} from './settings/routes';
import {StoreRoot} from '@/store';

export function RouterView() {
  async function navReady() {
    const infoList = await LS_UserInfo.get();

    if (infoList.length === 0) {
      navigationRef.dispatch(StackActions.replace('SignUpPage'));
    }
  }

  return (
    <NavigationContainer ref={navigationRef} onReady={navReady}>
      <RootStack.Navigator
        initialRouteName={'SignInPage'}
        screenOptions={{
          headerShown: false,
          gestureEnabled: Platform.OS === 'ios',
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {renderAuthorizationRouterView}
        <RootStack.Screen
          name="Tabbar"
          component={TabBarView}
          options={{headerShown: false, animationEnabled: false}}
        />
        {renderHomeRouterView}
        {renderSettingsRouterView}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TabBarView() {
  StoreRoot.useState();

  const tabbarOptionList: TabbarOption[] = [
    {
      name: 'HomePage',
      label: I18n.Ledger,
      icon: IONName.Home,
    },
    {
      name: 'SettingPage',
      label: I18n.Settings,
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
          tabBarBackground: () => opt?.backgroundColor,
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
