import {useCallback} from 'react';
import {createStore} from '@/libs/CreateStore';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateHomePage from './homePage/dispatch';
import initialStateHomePage from './homePage/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const HomePageDispatch = StoreHomePage.useDispatch();

  return useCallback(() => {
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    HomePageDispatch('reset');
  }, [RootDispatch, HomePageDispatch]);
}

export const StoreHomePage = createStore(
  initialStateHomePage,
  dispatchAggregateHomePage,
);
