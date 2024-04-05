import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
import {Colors, ColorsInstance, ThemeCode} from './configs/colors';
import {generateUUID} from './utils/tools';
import {Store} from './store';

LS.get('app_uuid').then(app_uuid => {
  if (app_uuid) {
    Store.update('app_uuid', app_uuid);
  } else {
    const uuid = generateUUID();
    Store.update('app_uuid', uuid);
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
