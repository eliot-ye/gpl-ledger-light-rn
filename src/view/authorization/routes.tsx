import React from 'react';
import {RootStack} from '../Router';

import {SignInPage} from './SignInPage';

export type AuthorizationStackParamList = {
  SignInPage: undefined;
};

export const renderAuthorizationRouterView = (
  <>
    <RootStack.Screen
      name="SignInPage"
      component={SignInPage}
      options={{animationEnabled: false}}
    />
  </>
);
