import {createReactConstant} from '@/libs/ReactConstant';
import DeviceInfo from 'react-native-device-info';
import envDefault, {ApiServerName} from './env.default';
import envProd from './env.prod';
import {Include} from '../../../types/global';

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

export const EnvInstance = createReactConstant({
  [EnvCode.DEV]: envDefault,
  [EnvCode.PROD]: {...envDefault, ...envProd},
});
export const {Constant: envConstant} = EnvInstance;

const bundleId = DeviceInfo.getBundleId();
envList.forEach(_envItem => {
  if (_envItem.bundleId.includes(bundleId)) {
    EnvInstance.setCode(_envItem.code);
  }
});

/** 只接受以 `CE_` 开头的 env key */
export function setAppEnv(envValue: CEnvVariable) {
  const keyList = Object.keys(envValue) as CEnvKey[];
  keyList.forEach(_key => {
    if (_key.startsWith('CE_')) {
      const _value = envValue[_key];
      if (_value !== undefined) {
        EnvInstance.setValue(_key, _value);
      }
    }
  });
}

export function getFetchUrl(serverName: ApiServerName, path: string) {
  let domain = '';
  let serverPath = envConstant.apiServerMap[serverName];

  envConstant.apiServerList
    .concat(envConstant.CE_ApiServerList)
    .forEach(item => {
      if (
        !item.ServerEnable ||
        (item.ServerEnable && item.ServerEnable.includes(serverName))
      ) {
        domain = item.Domain || domain;
        serverPath = item.ServerMap?.[serverName] ?? serverPath;
      }
    });

  return {domain, path: `${serverPath}${path}`};
}
