import {createHttp} from './http';
import {Platform} from 'react-native';
import {validator} from '@exodus/schemasafe';
import SVersionList from '../../public/SVersionList.json';

const validateVersion = validator(SVersionList);

const apiGet = createHttp('public', {method: 'GET'});

export const apiPublic = createApiPublic();

function createApiPublic() {
  return {
    /** 获取最新版本 */
    async nowVersion(): Promise<VersionItem[]> {
      const res = await apiGet('/now_version.json');
      if (!validateVersion(res)) {
        return Promise.reject(new Error('数据校验失败'));
      }
      return res;
    },
    /** 获取版本更新记录 */
    async versionLog(): Promise<VersionItem[]> {
      const res = await apiGet('/change_log.json');
      if (!validateVersion(res)) {
        return Promise.reject(new Error('数据校验失败'));
      }
      return res;
    },
  };
}

export interface UpdateLinkItem {
  updateLink: string;
  platform: typeof Platform.OS;
}

export interface VersionItem {
  platform: (typeof Platform.OS)[];
  updateLink?: string;
  updateLinks?: UpdateLinkItem[];
  versionName: string;
  versionCode: number;
  desc: string;
}
