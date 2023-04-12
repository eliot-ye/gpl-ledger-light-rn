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
import {StoreRoot, StoreUserInfo} from '@/store';
import {LS_Lang, LS_Theme} from '@/store/localStorage';

function RootView() {
  const RootDispatch = StoreRoot.useDispatch();

  useEffect(() => {
    LS_Theme.get().then(_code => {
      RootDispatch('theme', _code);
    });

    LS_Lang.get().then(_code => {
      RootDispatch('langCode', _code);
    });
  }, [RootDispatch]);

  return (
    <StoreUserInfo.Provider>
      <RouterView />
    </StoreUserInfo.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreRoot.Provider>
        <CPNPageModal.Provider>
          <RootView />
        </CPNPageModal.Provider>
        <CPNActionSheet.Provider />
        <CPNAlert.Provider />
        <CPNToast.Provider />
        <CPNLoading.Provider />
      </StoreRoot.Provider>
    </SafeAreaProvider>
  );
}
