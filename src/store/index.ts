import {useCallback} from 'react';
import {createStore} from '@/libs/ReactContextStore';
import {resetSessionStorage} from './sessionStorage';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateBackupPage from './backupPage/dispatch';
import initialStateBackupPage from './backupPage/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const BackupPageDispatch = StoreBackupPage.useDispatch();

  return useCallback(() => {
    resetSessionStorage();
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    BackupPageDispatch('reset');
  }, [RootDispatch, BackupPageDispatch]);
}

export const StoreBackupPage = createStore(
  initialStateBackupPage,
  dispatchAggregateBackupPage,
);
