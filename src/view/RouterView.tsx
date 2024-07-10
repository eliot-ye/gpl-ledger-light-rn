import React, {useEffect} from 'react';
import {
  NavigationContainer,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import {
  navigationRef,
  RootStack,
  TabbarStackParamList,
  TabStack,
} from './Router';
import {CPNIonicons, CPNText, CPNToast, IONName} from '@components/base';
import {Colors, ColorsInstance} from '@/configs/colors';
import {BackHandler, View} from 'react-native';
import {LS_UserInfo} from '@/store/localStorage';
import {I18n} from '@/assets/I18n';
import {injectControlJSON} from '@/configs/envControl';
import {envConstant} from '@/configs/env';
import {CusLog} from '@/utils/tools';

import {RTVWelcome} from './welcome/routes';
import {RTVAuthorization} from './authorization/routes';
import {HomePage, RTVHome} from './ledger/routes';
import {RTVSettings, SettingPage} from './settings/routes';
import {RTVAboutApp} from './aboutApp/routes';

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
    } else {
      navigationRef.dispatch(StackActions.replace('SignInPage'));
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
        initialRouteName={'SplashPage'}
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        {RTVWelcome}
        {RTVAuthorization}
        {RTVAboutApp}
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
  const navigation = useNavigation();
  I18n.useLangCode();
  ColorsInstance.useCode();

  useEffect(() => {
    let canExitApp = false;
    function onBackPress() {
      if (canExitApp) {
        BackHandler.exitApp();
      } else {
        const id = CPNToast.open(I18n.t('PressAgainToExit'));
        canExitApp = true;
        setTimeout(() => {
          CPNToast.close(id);
          canExitApp = false;
        }, 2000);
      }
    }
    function handleBackButton() {
      const isFocused = navigation.isFocused();
      if (isFocused) {
        onBackPress();
      }
      return isFocused;
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [navigation]);

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
          tabBarLabel: ({color}) => (
            <CPNText style={{color, fontSize: 12, marginHorizontal: 16}}>
              {opt?.label}
            </CPNText>
          ),
          tabBarIcon: ({color, focused}) => (
            <CPNIonicons
              name={opt?.icon as IONName}
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
