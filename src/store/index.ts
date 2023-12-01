import {useCallback} from 'react';
import {createStore} from '@/libs/ReactContextStore';
import {resetSessionStorage} from './sessionStorage';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  return useCallback(() => {
    resetSessionStorage();
    RootDispatch('isSignIn', initialStateRoot.isSignIn);
  }, [RootDispatch]);
}
