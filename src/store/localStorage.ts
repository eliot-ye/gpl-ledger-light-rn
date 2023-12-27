import {MD5, StringToUint8Array} from '@/utils/encoding';
import {langDefault} from '@assets/I18n';
import {ThemeCode} from '@/configs/colors';
import Realm from 'realm';
import {LSSchemaName, createObjectSchema} from '@/database/schemaType';
import {envConstant} from '@/configs/env';
import {useEffect, useState} from 'react';
import {StorageEngine, createLocalStorage} from '@/libs/LocalStorage';

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

let LSRealm: undefined | Realm;
async function getLSRealm() {
  if (!LSRealm) {
    LSRealm = await Realm.open({
      schema: [LSSchema, LSUserInfoSchema],
      schemaVersion: 1,
      encryptionKey: StringToUint8Array(
        MD5(envConstant.bundleId) + MD5(envConstant.salt),
      ),
    });
  }
  return LSRealm;
}

export const LocalStorageEngine: StorageEngine = {
  async getItem(key) {
    const LSR = await getLSRealm();
    const data = LSR.objectForPrimaryKey<LSItem>(LSSchema.name, key);
    return data?.value;
  },
  async setItem(key, value) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      LSR.create(LSSchema.name, {key, value}, Realm.UpdateMode.All);
    });
  },
  async removeItem(key) {
    const LSR = await getLSRealm();
    LSR.write(() => {
      const data = LSR.objectForPrimaryKey<LSItem>(LSSchema.name, key);
      if (data) {
        LSR.delete(data);
      }
    });
  },
};
export const LS = createLocalStorage(
  {
    theme_code: ThemeCode.default as ThemeCode | null,
    lang_code: langDefault,
    env_alert_onceId: '',
    last_user_id: '',
    web_dav_auto_sync: false,
  },
  LocalStorageEngine,
);

export interface LSUserInfo {
  id: string;
  username: string;
  token: string;
  biometriceToken?: string;
  web_dav?: string;
  lastModified?: string;
}
const LSUserInfoSchema = createObjectSchema<LSUserInfo>({
  name: LSSchemaName.LSUserInfo,
  primaryKey: 'id',
  properties: {
    id: 'string',
    username: 'string',
    token: 'string',
    biometriceToken: 'string?',
    web_dav: 'string?',
    lastModified: 'string?',
  },
});
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
