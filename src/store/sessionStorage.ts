import {createReactiveConstant} from '@/libs/ReactiveConstant';
import {WebDAVObject} from '@/libs/WebDAV';
import {useEffect, useState} from 'react';

const sessionStorageDefault = {
  userId: undefined as string | undefined,
  username: undefined as string | undefined,
  password: undefined as string | undefined,
  biometriceToken: undefined as string | undefined,
  WebDAVObject: null as WebDAVObject | null,
};

type SessionStorageDefault = typeof sessionStorageDefault;
type SessionStorageKey = keyof SessionStorageDefault;

export const SessionStorage = createReactiveConstant({
  default: sessionStorageDefault,
});
export function useSessionStorage() {
  const [sessionStorage, setSessionStorage] = useState(sessionStorageDefault);

  useEffect(() => {
    const subscribeId = SessionStorage.$subscribe(nValue => {
      setSessionStorage(oValue => ({...oValue, ...nValue}));
    });
    return () => {
      if (subscribeId) {
        SessionStorage.$unsubscribe(subscribeId);
      }
    };
  }, []);

  return sessionStorage;
}

const sessionStorageCopy = JSON.parse(JSON.stringify(sessionStorageDefault));
export function resetSessionStorage() {
  (Object.keys(sessionStorageCopy) as SessionStorageKey[]).forEach(key => {
    SessionStorage.$setValue(key, sessionStorageCopy[key]);
  });
}
