import DeviceInfo from 'react-native-device-info';

export type ApiServerMap = typeof apiServerMap;
export type ApiServerName = keyof ApiServerMap;
const apiServerMap = {
  main: 'api/main',
  test: 'api',
  seedData: 'v1/seedData',
};

export default {
  appName: DeviceInfo.getApplicationName(),
  versionName: DeviceInfo.getVersion(),
  versionCode: DeviceInfo.getBuildNumber(),

  /** 必须以 `/` 结尾 */
  apiDomain: 'https://uat2-arrtureapi.arrture.com/',
  /** 不可以以 `/` 开头和结尾 */
  apiServerMap,

  /** 必须以 `/` 结尾 */
  CE_ApiDomain: '',
  /** 不可以以 `/` 开头和结尾 */
  CE_ApiServerMap: {} as Partial<ApiServerMap>,
  CE_ApiServerNameList: [] as ApiServerName[],
};
