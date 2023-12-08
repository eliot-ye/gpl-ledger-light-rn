import {MD5, stringToUint8Array} from '@/utils/encoding';
import {LangCode, langDefault} from '@assets/I18n';
import {ThemeCode} from '@/configs/colors';
import Realm from 'realm';
import {LSSchemaName, createObjectSchema} from '@/database/schemaType';
import {envConstant} from '@/configs/env';
import {useEffect, useState} from 'react';

interface LSItem {
  key: string;
  value: string;
}
const LSSchema = createObjectSchema<LSItem>({
  name: LSSchemaName.LSItem,
  primaryKey: 'key',
  properties: {
    key: 'string',
    value: {
      type: 'string',
      optional: true,
    },
  },
});

const LSUserInfoSchema = createObjectSchema<LSUserInfo>({
  name: LSSchemaName.LSUserInfo,
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: 'string',
    token: 'string',
    biometriceToken: {
      type: 'string',
      optional: true,
    },
    web_dav: {
      type: 'string',
      optional: true,
    },
    lastModified: {
      type: 'string',
      optional: true,
    },
  },
});

let LSRealm: undefined | Realm;
async function getLSRealm() {
  if (!LSRealm) {
    LSRealm = await Realm.open({
      schema: [LSSchema, LSUserInfoSchema],
      schemaVersion: 1,
      encryptionKey: stringToUint8Array(
        MD5(envConstant.bundleId) + MD5(envConstant.salt),
      ),
    });
  }
  return LSRealm;
}

export interface LSUserInfo {
  id: string;
  username: string;
  token: string;
  biometriceToken?: string;
  web_dav?: string;
  lastModified?: string;
}
export const LS_UserInfo = {
  key: 'user_info',
  async get(): Promise<LSUserInfo[]> {
    const LSR = await getLSRealm();
    return LSR.objects<LSUserInfo>(LSUserInfoSchema.name).toJSON() as any;
  },
  async getById(id: string): Promise<LSUserInfo | undefined> {
    const LSR = await getLSRealm();
    const data = LSR.objectForPrimaryKey<LSUserInfo>(LSUserInfoSchema.name, id);
    if (data) {
      return data.toJSON() as any;
    }
    return undefined;
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
export function useLSUserInfoList() {
  const [data, setData] = useState<LSUserInfo[]>([]);
  useEffect(() => {
    const listener = () => LS_UserInfo.get().then(setData);

    LS_UserInfo.get()
      .then(setData)
      .then(() => {
        if (LSRealm) {
          LSRealm.addListener('change', listener);
        }
      });

    return () => {
      if (LSRealm) {
        LSRealm.removeListener('change', listener);
      }
    };
  }, []);

  return data;
}

export const LSRealmStorage = {
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
    if (!data) {
      return null;
    }
    return data as ThemeCode;
  },
  set(data: ThemeCode | null) {
    return LSRealmStorage.set(this.key, data || '');
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
export const LS_EnvAlertOnceId = {
  key: 'env_alert_onceId',
  async get() {
    const data = await LSRealmStorage.get(this.key);
    return data;
  },
  async set(data: string) {
    return LSRealmStorage.set(this.key, data);
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
