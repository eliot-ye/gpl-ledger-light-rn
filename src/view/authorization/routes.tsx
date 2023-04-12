import React from 'react';
import {RootStack} from '../Router';

import {SignInPage} from './SignInPage';
import {SignUpPage} from './SignUpPage';

export type AuthorizationStackParamList = {
  SignUpPage: undefined;
  SignInPage: undefined;
};

export const renderAuthorizationRouterView = (
  <>
    <RootStack.Screen name="SignInPage" component={SignInPage} />
    <RootStack.Screen name="SignUpPage" component={SignUpPage} />
  </>
);
