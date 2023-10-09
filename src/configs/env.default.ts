import DeviceInfo from 'react-native-device-info';

export type ApiServerMap = typeof ServerMap;
export type ApiServerName = keyof ApiServerMap;
interface ApiServerItem {
  /** 必须以 `/` 结尾 */
  readonly Domain: string;
  /** 不可以以 `/` 开头和结尾 */
  readonly ServerMap?: Partial<ApiServerMap>;
  readonly ServerEnable?: ApiServerName[];
}
interface CEApiServerItem extends ApiServerItem {
  readonly ServerEnable: ApiServerName[];
}

const ServerMap = {
  giteePublic: 'public/GPL/ledger-light-rn-dev',
};

export default {
  /** @example 'Apple' */
  brand: DeviceInfo.getBrand(),
  /** @example 'iPhone 14 Pro' */
  model: DeviceInfo.getModel(),
  appName: DeviceInfo.getApplicationName(),
  bundleId: DeviceInfo.getBundleId(),
  versionName: DeviceInfo.getVersion(),
  versionCode: DeviceInfo.getBuildNumber(),

  salt: 'salt',

  envControlPath: '',
  CE_OnChangeRoute: false,

  apiServerMap: ServerMap,

  apiServerList: [
    {
      Domain: 'https://eliot-ye.gitee.io/',
      ServerEnable: ['giteePublic'],
    },
  ] as ApiServerItem[],

  CE_ApiServerList: [] as CEApiServerItem[],
};
