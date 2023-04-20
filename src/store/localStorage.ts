import AsyncStorage from '@react-native-async-storage/async-storage';
import {LangCode, langDefault} from '@assets/I18n';
import {ThemeCode} from '@/configs/colors';

export const LS_Theme = {
  key: 'theme_code',
  async get() {
    const data = await AsyncStorage.getItem(this.key);
    return (data || ThemeCode.default) as ThemeCode;
  },
  set(data: ThemeCode) {
    return AsyncStorage.setItem(this.key, data);
  },
};

export const LS_Lang = {
  key: 'lang_code',
  async get() {
    const data = await AsyncStorage.getItem(this.key);
    return (data || langDefault) as LangCode;
  },
  set(data: LangCode) {
    return AsyncStorage.setItem(this.key, data);
  },
};

export const LS_Token = {
  key: 'token',
  async get() {
    return AsyncStorage.getItem(this.key);
  },
  async set(token: string) {
    return AsyncStorage.setItem(this.key, token);
  },
  remove() {
    return AsyncStorage.removeItem(this.key);
  },
};

export interface LSUserInfo {
  id: string;
  username: string;
  token: string;
}
export const LS_UserInfo = {
  key: 'user_info',
  async get(): Promise<LSUserInfo[]> {
    const dataStr = await AsyncStorage.getItem(this.key);
    if (!dataStr) {
      return [];
    }
    return JSON.parse(dataStr);
  },
  async set(data: LSUserInfo) {
    const oldData = await this.get();
    if (oldData.map(item => item.id).includes(data.id)) {
      const _data = oldData.find(item => item.id === data.id);
      if (_data) {
        _data.token = data.token;
        _data.username = data.username;
      }
      const dataStr = JSON.stringify([...oldData]);
      return AsyncStorage.setItem(this.key, dataStr);
    } else {
      const dataStr = JSON.stringify([...oldData, data]);
      return AsyncStorage.setItem(this.key, dataStr);
    }
  },
  async remove(id: string) {
    const oldData = await this.get();
    const ids = oldData.map(item => item.id);
    if (ids.includes(id)) {
      oldData.splice(ids.indexOf(id), 1);
      return AsyncStorage.setItem(this.key, JSON.stringify(oldData));
    } else {
      return Promise.reject(`id(${id})不存在`);
    }
  },
};

export const LS_LastUserId = {
  key: 'last_user_id',
  get() {
    return AsyncStorage.getItem(this.key);
  },
  set(id: string) {
    return AsyncStorage.setItem(this.key, id);
  },
};
