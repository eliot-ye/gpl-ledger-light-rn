import {useCallback} from 'react';
import {createStore} from '@/libs/CreateStore';

import dispatchAggregateRoot from './root/dispatch';
import initialStateRoot from './root/initialState';

import dispatchAggregateExample from './example/dispatch';
import initialStateExample from './example/initialState';

export const StoreRoot = createStore(initialStateRoot, dispatchAggregateRoot);

export function useResetStore() {
  const RootDispatch = StoreRoot.useDispatch();

  const ExampleDispatch = StoreExample.useDispatch();

  return useCallback(() => {
    RootDispatch('isSignIn', initialStateRoot.isSignIn);

    ExampleDispatch('reset');
  }, [RootDispatch, ExampleDispatch]);
}

export const StoreExample = createStore(
  initialStateExample,
  dispatchAggregateExample,
);
