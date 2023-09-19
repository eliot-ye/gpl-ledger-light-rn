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
import {StoreRoot, StoreHomePage, StoreBackupPage} from '@/store';
import {LS_Lang, LS_Theme} from '@/store/localStorage';
import {useColorScheme} from 'react-native';
import {ThemeCode} from './configs/colors';
import {I18n} from './assets/I18n';

function RootView() {
  const RootDispatch = StoreRoot.useDispatch();

  const systemTheme = useColorScheme() as ThemeCode;
  useEffect(() => {
    LS_Theme.get().then(_code => {
      RootDispatch('theme', _code || systemTheme || ThemeCode.default);
    });
  }, [RootDispatch, systemTheme]);

  useEffect(() => {
    LS_Lang.get().then(_code => {
      I18n.setLangCode(_code);
    });
  }, [RootDispatch]);

  return (
    <StoreHomePage.Provider>
      <StoreBackupPage.Provider>
        <RouterView />
      </StoreBackupPage.Provider>
    </StoreHomePage.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <I18n.Provider>
        <StoreRoot.Provider>
          <CPNPageModal.Provider>
            <RootView />
          </CPNPageModal.Provider>
          <CPNActionSheet.Provider />
          <CPNAlert.Provider />
          <CPNToast.Provider />
          <CPNLoading.Provider />
        </StoreRoot.Provider>
      </I18n.Provider>
    </SafeAreaProvider>
  );
}
