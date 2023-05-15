import {CreateReactiveConstant} from '@/libs/CreateReactiveConstant';
import {WebDAVObject} from '@/libs/CreateWebDAV';

const sessionStorageDefault = {
  userId: undefined as string | undefined,
  username: undefined as string | undefined,
  password: undefined as string | undefined,
  WebDAVObject: null as WebDAVObject | null,
};

type SessionStorageDefault = typeof sessionStorageDefault;
type SessionStorageKey = keyof SessionStorageDefault;

export const SessionStorage = CreateReactiveConstant({
  default: sessionStorageDefault,
});

const sessionStorageCopy = JSON.parse(JSON.stringify(sessionStorageDefault));
export function resetSessionStorage() {
  (Object.keys(sessionStorageCopy) as SessionStorageKey[]).forEach(key => {
    SessionStorage.setValue(key, sessionStorageCopy[key]);
  });
}
