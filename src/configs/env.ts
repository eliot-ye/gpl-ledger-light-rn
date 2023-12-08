import {createReactiveConstant} from '@/libs/ReactiveConstant';
import DeviceInfo from 'react-native-device-info';
import envDefault, {ApiServerName} from './env.default';
import envProd from './env.prod';

export type EnvVariable = typeof envDefault;
export type CEnvKey = Include<keyof EnvVariable, `CE_${string}`>;
export type CEnvVariable = Partial<Pick<EnvVariable, CEnvKey>>;

interface EnvListItem {
  code: EnvCode;
  bundleId: string[];
}
export enum EnvCode {
  DEV = 'DEV',
  PROD = 'PROD',
}
const envList: EnvListItem[] = [
  {code: EnvCode.DEV, bundleId: ['com.gpl.ledger.light.rn.dev']},
  {code: EnvCode.PROD, bundleId: ['com.gpl.ledger.light.rn']},
];

const _envConstant = createReactiveConstant({
  [EnvCode.DEV]: {...envDefault},
  [EnvCode.PROD]: {...envDefault, ...envProd},
});
export const envConstant = _envConstant as EnvVariable;

const bundleId = DeviceInfo.getBundleId();
envList.forEach(_envItem => {
  if (_envItem.bundleId.includes(bundleId)) {
    _envConstant.$setCode(_envItem.code);
  }
});

/** 只接受以 `CE_` 开头的 env key */
export function setAppEnv(envValue: CEnvVariable) {
  const keyList = Object.keys(envValue) as CEnvKey[];
  keyList.forEach(_key => {
    if (_key.indexOf('CE_') === 0) {
      const _value = envValue[_key];
      if (_value !== undefined) {
        _envConstant.$setValue(_key, _value);
      }
    }
  });
}

export function getFetchUrl(serverName: ApiServerName, path: string) {
  let domain = '';
  let serverPath = _envConstant.apiServerMap[serverName];

  _envConstant.apiServerList
    .concat(_envConstant.CE_ApiServerList)
    .forEach(item => {
      if (
        !item.ServerEnable ||
        (item.ServerEnable && item.ServerEnable.includes(serverName))
      ) {
        domain = item.Domain || domain;
        serverPath =
          (item.ServerMap && item.ServerMap[serverName]) || serverPath;
      }
    });

  return {domain, path: `${serverPath}${path}`};
}
