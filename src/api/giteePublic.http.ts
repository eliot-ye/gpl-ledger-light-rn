import {useMemo} from 'react';
import {useFetch} from './http';
import {VersionItem, giteePublic} from './giteePublic.schema';

export function useApiGiteePublic() {
  const apiGet = useFetch(
    'giteePublic',
    useMemo(
      () => ({
        method: 'GET',
      }),
      [],
    ),
  );

  return useMemo(
    () => ({
      /** 获取最新版本 */
      async nowVersion(): Promise<VersionItem[]> {
        const res = await apiGet('/now_version.json');
        if (!giteePublic.validateVersion(res)) {
          return Promise.reject(new Error('数据校验失败'));
        }
        return res;
      },
      /** 获取版本更新记录 */
      async versionLog(): Promise<VersionItem[]> {
        const res = await apiGet('/change_log.json');
        if (!giteePublic.validateVersion(res)) {
          return Promise.reject(new Error('数据校验失败'));
        }
        return res;
      },
    }),
    [apiGet],
  );
}
