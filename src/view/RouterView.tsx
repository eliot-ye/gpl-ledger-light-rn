import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import {StoreRoot} from '@/store';
import {
  navigationRef,
  RootStack,
  TabbarStackParamList,
  TabStack,
} from './Router';
import {CPNIonicons, CPNText, IONName} from '@components/base';
import {Colors} from '@/configs/colors';
import {Platform, View} from 'react-native';
import {LS_UserInfo} from '@/store/localStorage';

import {renderAuthorizationRouterView} from './authorization/routes';
import {HomePage} from './ledger/routes';
import {SettingPage} from './settings/routes';

export function RouterView() {
  const RootState = StoreRoot.useState();

  async function navReady() {
    const infoList = await LS_UserInfo.get();
    console.log('infoList', infoList);

    navigationRef.navigate('SignUpPage');
    if (infoList.length === 0) {
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
        {RootState.isSignIn ? (
          <>
            <RootStack.Screen
              name="Tabbar"
              component={TabBarView}
              options={{headerShown: false, animationEnabled: false}}
            />
          </>
        ) : (
          renderAuthorizationRouterView
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TabBarView() {
  const tabbarOptionList: TabbarOption[] = [
    {
      name: 'HomePage',
      label: 'Home',
      icon: IONName.Home,
      backgroundColor: (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.success,
          }}
        />
      ),
      textColor: Colors.backgroundGrey,
      textActiveColor: Colors.fontTextReverse,
    },
    {
      name: 'SettingPage',
      label: 'Settings',
      icon: IONName.Settings,
      backgroundColor: (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.warning,
          }}
        />
      ),
      textColor: Colors.backgroundGrey,
      textActiveColor: Colors.fontTextReverse,
    },
  ];

  return (
    <TabStack.Navigator
      screenOptions={({route}) => {
        const opt = tabbarOptionList.find(_item => _item.name === route.name);

        return {
          headerShown: false,
          tabBarActiveTintColor: opt?.textActiveColor,
          tabBarInactiveTintColor: opt?.textColor,
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
              size={focused ? 26 : 20}
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
  backgroundColor: React.ReactNode;
  textColor: string;
  textActiveColor: string;
}
