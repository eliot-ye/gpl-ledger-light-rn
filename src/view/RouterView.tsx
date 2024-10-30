import React from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import {navigationRef, RootStack} from './Router';
import {LS_UserInfo} from '@/store/localStorage';
import {
  ControlJSONError,
  injectControlJSON,
} from '@/assets/environment/envControl';
import {envConstant} from '@/assets/environment';
import {CusLog} from '@/utils/tools';

import {RTVWelcome} from './welcome/routes';
import {RTVAuthorization} from './authorization/routes';
import {RTVHome} from './ledger/routes';
import {RTVSettings} from './settings/routes';
import {RTVAboutApp} from './aboutApp/routes';
import {TabBarView} from './TabBarView';

export function RouterView() {
  async function navReady() {
    try {
      const res = await Promise.allSettled([injectControlJSON()]);
      if (
        res[0].status === 'rejected' &&
        res[0].reason === ControlJSONError.IS_BLOCK
      ) {
        return;
      }
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
