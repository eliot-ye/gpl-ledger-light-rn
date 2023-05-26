import {CreateReactiveConstant} from '@/libs/CreateReactiveConstant';
import DeviceInfo from 'react-native-device-info';
import envDefault, {ApiServerName} from './env.default';
import envUat from './env.uat';

export type EnvVariable = typeof envDefault;

interface EnvListItem {
  code: EnvCode;
  bundleId: string[];
}
enum EnvCode {
  UAT = 'UAT',
}
const envList: EnvListItem[] = [{code: EnvCode.UAT, bundleId: []}];

export const envConstant = CreateReactiveConstant({
  [EnvCode.UAT]: {...envDefault, ...envUat},
});

const bundleId = DeviceInfo.getBundleId();
envList.forEach(_envItem => {
  if (_envItem.bundleId.includes(bundleId)) {
    envConstant.setCode(_envItem.code);
  }
});

/** 只接受以 `CE_` 开头的 env key */
export function setAppEnv(envValue: Partial<EnvVariable>) {
  const keyList = Object.keys(envValue) as (keyof EnvVariable)[];
  keyList.forEach(_key => {
    if (_key.indexOf('CE_') === 0) {
      const _value = envValue[_key];
      if (_value !== undefined) {
        envConstant.setValue(_key, _value);
      }
    }
  });
}

export function getFetchUrl(serverName: ApiServerName, path: string) {
  let domain = '';
  let serverPath = envConstant.apiServerMap[serverName];

  envConstant.ApiServerList.concat(envConstant.CE_ApiServerList).forEach(
    item => {
      if (
        !item.ServerEnable ||
        (item.ServerEnable && item.ServerEnable.includes(serverName))
      ) {
        domain = item.Domain || domain;
        serverPath =
          (item.ServerMap && item.ServerMap[serverName]) || serverPath;
      }
    },
  );

  return {domain, path: `${serverPath}${path}`};
}
