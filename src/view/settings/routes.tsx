import React from 'react';
import {RootStack} from '../Router';

export * from './SettingPage';
import {ColorManagementPage} from './ColorManagementPage';
import {CurrencyManagementPage} from './CurrencyManagementPage';
import {AssetTypeManagementPage} from './AssetTypeManagementPage';
import {LangSettingPage} from './LangSettingPage';
import {AboutPage} from './AboutPage';
import {VersionLogPage} from './VersionLogPage';
import {BackupPage} from './BackupPage';
import {WebDAVPage} from './WebDAVPage';
import {ThemeSettingPage} from './ThemeSettingPage';

export type SettingsStackParamList = {
  ColorManagementPage: undefined;
  CurrencyManagementPage: undefined;
  AssetTypeManagementPage: undefined;

  LangSettingPage: undefined;
  ThemeSettingPage: undefined;
  BackupPage: undefined;
  WebDAVPage: undefined;

  AboutPage: undefined;
  VersionLogPage: undefined;
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

    <RootStack.Screen name="LangSettingPage" component={LangSettingPage} />
    <RootStack.Screen name="ThemeSettingPage" component={ThemeSettingPage} />
    <RootStack.Screen name="BackupPage" component={BackupPage} />
    <RootStack.Screen name="WebDAVPage" component={WebDAVPage} />

    <RootStack.Screen name="AboutPage" component={AboutPage} />
    <RootStack.Screen name="VersionLogPage" component={VersionLogPage} />
  </>
);
