import React from 'react';
import {RootStack} from '../Router';

export * from './SettingPage';
import {ColorManagementPage} from './ColorManagementPage';

export type SettingsStackParamList = {
  ColorManagementPage: undefined;
};

export const renderSettingsRouterView = (
  <>
    <RootStack.Screen
      name="ColorManagementPage"
      component={ColorManagementPage}
    />
  </>
);
