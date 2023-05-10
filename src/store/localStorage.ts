import {LangCode, langDefault} from '@assets/I18n';
import {ThemeCode} from '@/configs/colors';
import Realm from 'realm';
import {createObjectSchema} from '@/database/schemaType';

interface LSItem {
  key: string;
  value: string;
}
const LSSchema = createObjectSchema<LSItem>({
  name: 'LSItem',
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: 'string?',
  },
});

const LSUserInfoSchema = createObjectSchema<LSUserInfo>({
  name: 'LSUserInfo',
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: 'string',
    token: 'string',
    web_dav: 'string?',
  },
});

let LSRealm: undefined | Realm;
async function getLSRealm() {
  if (!LSRealm) {
    LSRealm = await Realm.open({
      schema: [LSSchema, LSUserInfoSchema],
      schemaVersion: 2,
    });
  }
  return LSRealm;
}

const LSRealmStorage = {
  async get(key: string) {
    const LSR = await getLSRealm();
    const data = LSR.objectForPrimaryKey<LSItem>(LSSchema.name, key);
    if (data) {
      return data.value;
    }
  },
  async set(key: string, value: string) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      LSR.create(LSSchema.name, {key, value}, Realm.UpdateMode.All);
    });
  },
  async remove(key: string) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      const data = LSR.objectForPrimaryKey<LSItem>(LSSchema.name, key);
      if (data) {
        LSR.delete(data);
      }
    });
  },
};

export const LS_Theme = {
  key: 'theme_code',
  async get() {
    const data = await LSRealmStorage.get(this.key);
    return (data || ThemeCode.default) as ThemeCode;
  },
  set(data: ThemeCode) {
    return LSRealmStorage.set(this.key, data);
  },
};

export const LS_Lang = {
  key: 'lang_code',
  async get() {
    const data = await LSRealmStorage.get(this.key);
    return (data || langDefault) as LangCode;
  },
  set(data: LangCode) {
    return LSRealmStorage.set(this.key, data);
  },
};

export const LS_Token = {
  key: 'token',
  async get() {
    return LSRealmStorage.get(this.key);
  },
  async set(token: string) {
    return LSRealmStorage.set(this.key, token);
  },
  remove() {
    return LSRealmStorage.remove(this.key);
  },
};

export interface LSUserInfo {
  id: string;
  username: string;
  token: string;
  web_dav?: string;
}
export const LS_UserInfo = {
  key: 'user_info',
  async get(): Promise<LSUserInfo[]> {
    const LSR = await getLSRealm();
    return LSR.objects<LSUserInfo>(LSUserInfoSchema.name).toJSON() as any;
  },
  async set(data: LSUserInfo) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      LSR.create<LSUserInfo>(LSUserInfoSchema.name, data, Realm.UpdateMode.All);
    });
  },
  async update(data: Partial<LSUserInfo>) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      LSR.create<LSUserInfo>(
        LSUserInfoSchema.name,
        data,
        Realm.UpdateMode.Modified,
      );
    });
  },
  async remove(id: string) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      const data = LSR.objectForPrimaryKey(LSUserInfoSchema.name, id);
      if (data) {
        LSR.delete(data);
      }
    });
  },
};

export const LS_LastUserId = {
  key: 'last_user_id',
  get() {
    return LSRealmStorage.get(this.key);
  },
  set(id: string) {
    return LSRealmStorage.set(this.key, id);
  },
};

export const LS_WebDAVAutoSync = {
  key: 'web_dav_auto_sync',
  async get() {
    const str = await LSRealmStorage.get(this.key);
    return str !== 'false';
  },
  set(data: boolean) {
    return LSRealmStorage.set(this.key, `${data}`);
  },
};
