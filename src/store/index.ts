import {useCallback} from 'react';
import {createStore} from '@/libs/CreateStore';
import {resetSessionStorage} from './sessionStorage';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateHomePage from './homePage/dispatch';
import initialStateHomePage from './homePage/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const HomePageDispatch = StoreHomePage.useDispatch();

  return useCallback(() => {
    resetSessionStorage();
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    HomePageDispatch('reset');
  }, [RootDispatch, HomePageDispatch]);
}

export const StoreHomePage = createStore(
  initialStateHomePage,
  dispatchAggregateHomePage,
);
