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

import {renderAuthorizationRouterView} from './authorization/routes';
import {renderTestRouterView, HomePage, AboutPage} from './test/routes';

export function RouterView() {
  const RootState = StoreRoot.useState();

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: Platform.OS === 'ios',
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {!RootState.isSignIn ? (
          renderAuthorizationRouterView
        ) : (
          <>
            <RootStack.Screen
              name="Tabbar"
              component={TabBarView}
              options={{headerShown: false, animationEnabled: false}}
            />
            {renderTestRouterView}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function TabBarView() {
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
      <TabStack.Screen name="AboutPage" component={AboutPage} />
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

const tabbarOptionList: TabbarOption[] = [
  {
    name: 'HomePage',
    label: 'Home',
    icon: IONName.home,
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
    name: 'AboutPage',
    label: 'About',
    icon: IONName.information,
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
