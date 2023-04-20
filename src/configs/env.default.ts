import DeviceInfo from 'react-native-device-info';

export type ApiServerMap = typeof apiServerMap;
export type ApiServerName = keyof ApiServerMap;
const apiServerMap = {
  giteePublic: 'public/GPL/ledger-light-rn',
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

  /** 必须以 `/` 结尾 */
  apiDomain: 'https://eliot-ye.gitee.io/',
  /** 不可以以 `/` 开头和结尾 */
  apiServerMap,

  /** 必须以 `/` 结尾 */
  CE_ApiDomain: '',
  /** 不可以以 `/` 开头和结尾 */
  CE_ApiServerMap: {} as Partial<ApiServerMap>,
  CE_ApiServerEnable: [] as ApiServerName[],
};
