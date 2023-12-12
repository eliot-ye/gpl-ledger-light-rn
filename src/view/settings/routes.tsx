import React from 'react';
import {RootStack} from '../Router';

export * from './SettingPage';
import {ColorManagementPage} from './ColorManagementPage';
import {CurrencyManagementPage} from './CurrencyManagementPage';
import {AssetTypeManagementPage} from './AssetTypeManagementPage';
import {BackupPage} from './BackupPage';
import {WebDAVPage} from './WebDAVPage';

export type StackParamListSettings = {
  ColorManagementPage: undefined;
  CurrencyManagementPage: undefined;
  AssetTypeManagementPage: undefined;

  BackupPage: undefined;
  WebDAVPage: undefined;
};

export const RTVSettings = (
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

    <RootStack.Screen name="BackupPage" component={BackupPage} />
    <RootStack.Screen name="WebDAVPage" component={WebDAVPage} />
  </>
);
