import {useCallback} from 'react';
import {createStore} from '@/libs/CreateStore';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateUserInfo from './userInfo/dispatch';
import initialStateUserInfo from './userInfo/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const UserInfoDispatch = StoreUserInfo.useDispatch();

  return useCallback(() => {
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    UserInfoDispatch('reset');
  }, [RootDispatch, UserInfoDispatch]);
}

export const StoreUserInfo = createStore(
  initialStateUserInfo,
  dispatchAggregateUserInfo,
);
