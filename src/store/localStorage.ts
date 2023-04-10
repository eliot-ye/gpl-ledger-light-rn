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

export async function LSLogout() {
  await LS_Token.remove();
  await LS_UserInfo.remove();
}

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
  name: string;
}
export const LS_UserInfo = {
  key: 'user_info',
  async get(): Promise<Partial<LSUserInfo>> {
    const dataStr = await AsyncStorage.getItem(this.key);
    if (!dataStr) {
      return {};
    }
    return JSON.parse(dataStr);
  },
  async set(data: Partial<LSUserInfo>) {
    const oldData = await this.get();
    const dataStr = JSON.stringify({...oldData, ...data});
    return AsyncStorage.setItem(this.key, dataStr);
  },
  remove() {
    return AsyncStorage.removeItem(this.key);
  },
};
