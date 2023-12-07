import {useEffect, useState} from 'react';
import {createSubscribeState} from './SubscribeState';

export function createReactSubscribeStore<T extends JSONConstraint>(
  initialState: T,
) {
  type Key = keyof T;

  const _initialState = JSON.parse(JSON.stringify(initialState));

  const SSInstance = createSubscribeState(initialState);

  return {
    get: SSInstance.$get,
    useState<K extends Key>(key: K) {
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

    reset(exclusion: Key[] = []) {
      const keys = Object.keys(_initialState);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!exclusion.includes(key)) {
          SSInstance.$set(key, _initialState[key]);
        }
      }
    },
  };
}
