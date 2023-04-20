import {CreateReactiveConstant} from '@/libs/CreateReactiveConstant';

const sessionStorageDefault = {
  userId: undefined as string | undefined,
  password: undefined as string | undefined,
};

type SessionStorageDefault = typeof sessionStorageDefault;
type SessionStorageKey = keyof SessionStorageDefault;

export const SessionStorage = CreateReactiveConstant({
  default: {...sessionStorageDefault},
});

export function resetSessionStorage() {
  (Object.keys(sessionStorageDefault) as SessionStorageKey[]).forEach(key => {
    SessionStorage.setValue(key, sessionStorageDefault[key]);
  });
}
