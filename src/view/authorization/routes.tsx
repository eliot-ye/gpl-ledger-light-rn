import React from 'react';
import {RootStack} from '../Router';

import {SignInPage} from './SignInPage';
import {SignUpPage} from './SignUpPage';
import {ImportBackupPage} from './ImportBackupPage';
import {AccountManagementPage} from './AccountManagementPage';
import {AccountInfoPage} from './AccountInfoPage';
import {LSUserInfo} from '@/store/localStorage';

export type AuthorizationStackParamList = {
  SignUpPage: undefined;
  SignInPage: undefined;
  ImportBackupPage: undefined;
  AccountManagementPage: undefined;
  AccountInfoPage: LSUserInfo;
};

export const RTVAuthorization = (
  <>
    <RootStack.Screen name="SignInPage" component={SignInPage} />
    <RootStack.Screen name="SignUpPage" component={SignUpPage} />
    <RootStack.Screen name="ImportBackupPage" component={ImportBackupPage} />
    <RootStack.Screen
      name="AccountManagementPage"
      component={AccountManagementPage}
    />
    <RootStack.Screen name="AccountInfoPage" component={AccountInfoPage} />
  </>
);
