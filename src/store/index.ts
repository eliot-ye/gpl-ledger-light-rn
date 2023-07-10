import {useCallback} from 'react';
import {createStore} from '@/libs/ReactContextStore';
import {resetSessionStorage} from './sessionStorage';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateHomePage from './homePage/dispatch';
import initialStateHomePage from './homePage/initialState';

import dispatchAggregateBackupPage from './backupPage/dispatch';
import initialStateBackupPage from './backupPage/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const HomePageDispatch = StoreHomePage.useDispatch();
  const BackupPageDispatch = StoreBackupPage.useDispatch();

  return useCallback(() => {
    resetSessionStorage();
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    HomePageDispatch('reset');
    BackupPageDispatch('reset');
  }, [RootDispatch, HomePageDispatch, BackupPageDispatch]);
}

export const StoreHomePage = createStore(
  initialStateHomePage,
  dispatchAggregateHomePage,
);
export const StoreBackupPage = createStore(
  initialStateBackupPage,
  dispatchAggregateBackupPage,
);
