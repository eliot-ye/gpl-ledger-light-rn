import React from 'react';
import {RootStack} from '../Router';

import {LangSettingPage} from './LangSettingPage';
import {AboutPage} from './AboutPage';
import {VersionLogPage} from './VersionLogPage';
import {ThemeSettingPage} from './ThemeSettingPage';

export type StackParamListAboutApp = {
  LangSettingPage: undefined;
  ThemeSettingPage: undefined;

  AboutPage: undefined;
  VersionLogPage: undefined;
};

export const RTVAboutApp = (
  <>
    <RootStack.Screen name="LangSettingPage" component={LangSettingPage} />
    <RootStack.Screen name="ThemeSettingPage" component={ThemeSettingPage} />

    <RootStack.Screen name="AboutPage" component={AboutPage} />
    <RootStack.Screen name="VersionLogPage" component={VersionLogPage} />
  </>
);
