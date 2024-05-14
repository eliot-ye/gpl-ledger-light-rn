import {createReactSubscribeStore} from '@/libs/ReactSubscribeStore';
import {WebDAVObject} from '@/libs/WebDAV';

export const Store = createReactSubscribeStore({
  app_uuid: undefined as string | undefined,
  isDebug: false,
  isSignIn: false,
  userId: undefined as string | undefined,
  username: undefined as string | undefined,
  password: undefined as string | undefined,
  biometriceToken: undefined as string | undefined,
  WebDAVObject: null as WebDAVObject | null,
});
