import React from 'react';
import {RootStack} from '../Router';
import {SplashPage} from './SplashPage';

export type StackParamListWelcome = {
  SplashPage: undefined;
};

export const RTVWelcome = (
  <>
    <RootStack.Screen name="SplashPage" component={SplashPage} />
  </>
);
