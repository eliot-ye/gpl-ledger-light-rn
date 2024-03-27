import DeviceInfo from 'react-native-device-info';

declare namespace NSEnv {
  type ApiServerName<T> = keyof T;

  interface ApiServerItem<T> {
    /** 必须以 `/` 结尾 */
    readonly Domain: string;
    /** 不可以以 `/` 开头和结尾 */
    readonly ServerMap?: Partial<T>;
    readonly ServerEnable?: ApiServerName<T>[];
  }
  interface CEApiServerItem<T> extends ApiServerItem<T> {
    readonly ServerEnable: ApiServerName<T>[];
  }
}

export type ApiServerMap = typeof ServerMap;
export type ApiServerName = NSEnv.ApiServerName<ApiServerMap>;

const ServerMap = {
  giteePublic: 'public/GPL/ledger-light-rn-dev',
};
const apiServerList: NSEnv.ApiServerItem<ApiServerMap>[] = [
  {
    Domain: 'https://eliot-ye.gitee.io/',
    ServerEnable: ['giteePublic'],
  },
];
const CE_ApiServerList: NSEnv.CEApiServerItem<ApiServerMap>[] = [];

export default {
  /** @example 'Apple' */
  brand: DeviceInfo.getBrand(),
  /** @example 'iPhone 14 Pro' */
  model: DeviceInfo.getModel(),
  appName: DeviceInfo.getApplicationName(),
  bundleId: DeviceInfo.getBundleId(),
  versionName: DeviceInfo.getVersion(),
  versionCode: Number(DeviceInfo.getBuildNumber()),

  iosAppStoreId: '',

  salt: 'salt',

  envControlPath: '',
  CE_OnChangeRoute: false,

  apiServerMap: ServerMap,
  apiServerList,
  CE_ApiServerList,
};
