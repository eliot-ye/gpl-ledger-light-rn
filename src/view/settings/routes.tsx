import React from 'react';
import {RootStack} from '../Router';

export * from './SettingPage';
import {ColorManagementPage} from './ColorManagementPage';
import {CurrencyManagementPage} from './CurrencyManagementPage';
import {AssetTypeManagementPage} from './AssetTypeManagementPage';

export type SettingsStackParamList = {
  ColorManagementPage: undefined;
  CurrencyManagementPage: undefined;
  AssetTypeManagementPage: undefined;
};

export const renderSettingsRouterView = (
  <>
    <RootStack.Screen
      name="ColorManagementPage"
      component={ColorManagementPage}
    />
    <RootStack.Screen
      name="CurrencyManagementPage"
      component={CurrencyManagementPage}
    />
    <RootStack.Screen
      name="AssetTypeManagementPage"
      component={AssetTypeManagementPage}
    />
  </>
);
