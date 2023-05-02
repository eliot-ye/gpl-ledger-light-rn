import React from 'react';
import {RootStack} from '../Router';

import {SignInPage} from './SignInPage';
import {SignUpPage} from './SignUpPage';
import {ImportBackupPage} from './ImportBackupPage';

export type AuthorizationStackParamList = {
  SignUpPage: undefined;
  SignInPage: undefined;
  ImportBackupPage: undefined;
};

export const renderAuthorizationRouterView = (
  <>
    <RootStack.Screen name="SignInPage" component={SignInPage} />
    <RootStack.Screen name="SignUpPage" component={SignUpPage} />
    <RootStack.Screen name="ImportBackupPage" component={ImportBackupPage} />
  </>
);
