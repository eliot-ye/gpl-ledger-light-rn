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
import {StoreRoot, StoreExample} from '@/store';
import {LS_Lang, LS_Theme, LS_Token} from '@/store/localStorage';

function RootView() {
  const RootDispatch = StoreRoot.useDispatch();

  useEffect(() => {
    LS_Theme.get().then(_code => {
      RootDispatch('theme', _code);
    });

    LS_Lang.get().then(_code => {
      RootDispatch('langCode', _code);
    });

    LS_Token.get().then(async _token => {
      if (_token) {
        // 此处可请求一个 API 验证 token 是否有效
        RootDispatch('isSignIn', true);
      }
    });
  }, [RootDispatch]);

  return (
    <StoreExample.Provider>
      <RouterView />
    </StoreExample.Provider>
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
