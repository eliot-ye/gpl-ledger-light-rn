import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {
  CPNActionSheet,
  CPNAlert,
  CPNLoading,
  CPNToast,
  CPNPageModal,
} from '@components/base';
import {RouterView} from '@/view/RouterView';
import {LS} from '@/store/localStorage';
import {StatusBar, useColorScheme} from 'react-native';
import {Colors, ColorsInstance, ThemeCode} from './assets/colors';
import {generateUUID} from './utils/tools';
import {SessionStorage} from './store/sessionStorage';

SystemNavigationBar.setFitsSystemWindows(false);
SystemNavigationBar.setNavigationColor(Colors.transparent);

LS.get('app_uuid').then(app_uuid => {
  if (app_uuid) {
    SessionStorage.update('app_uuid', app_uuid);
  } else {
    const uuid = generateUUID();
    SessionStorage.update('app_uuid', uuid);
    LS.set('app_uuid', uuid);
  }
});

function RootView() {
  const systemTheme = useColorScheme() as ThemeCode;
  useEffect(() => {
    LS.get('theme_code').then(_code => {
      ColorsInstance.setCode(_code || systemTheme || ThemeCode.default);
    });
  }, [systemTheme]);

  return <RouterView />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={Colors.transparent} translucent />
      <CPNPageModal.Provider>
        <RootView />
      </CPNPageModal.Provider>
      <CPNActionSheet.Provider />
      <CPNAlert.Provider />
      <CPNToast.Provider />
      <CPNLoading.Provider />
    </SafeAreaProvider>
  );
}
