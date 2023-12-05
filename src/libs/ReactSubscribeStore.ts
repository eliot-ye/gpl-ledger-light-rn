import {useEffect, useState} from 'react';
import {createSubscribeState} from './SubscribeState';

export function createReactSubscribeStore<T extends JSONConstraint>(
  initialState: T,
) {
  const _initialState = JSON.parse(JSON.stringify(initialState));

  const SSInstance = createSubscribeState(initialState);

  return {
    get: SSInstance.$get,
    useState<K extends keyof T>(key: K) {
      const [state, stateSet] = useState(SSInstance.$get(key));

      useEffect(() => {
        const subscribeId = SSInstance.$subscribe(
          value => {
            stateSet(value[key]);
          },
          [key],
        );
        return () => {
          if (subscribeId) {
            SSInstance.$unsubscribe(subscribeId);
          }
        };
      }, [key]);

      return state;
    },

    update: SSInstance.$set,

    reset() {
      const keys = Object.keys(_initialState);
      keys.forEach(key => {
        SSInstance.$set(key, _initialState[key]);
      });
    },
  };
}
