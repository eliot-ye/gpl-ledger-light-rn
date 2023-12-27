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
import {useColorScheme} from 'react-native';
import {ColorsInstance, ThemeCode} from './configs/colors';
import {I18n} from './assets/I18n';

function RootView() {
  const systemTheme = useColorScheme() as ThemeCode;
  useEffect(() => {
    LS.get('theme_code').then(_code => {
      ColorsInstance.setTheme(_code || systemTheme || ThemeCode.default);
    });
  }, [systemTheme]);

  useEffect(() => {
    LS.get('lang_code').then(_code => {
      I18n.setLangCode(_code);
    });
  }, []);

  return <RouterView />;
}

export default function App() {
  return (
    <SafeAreaProvider>
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
