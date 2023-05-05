import {useMemo} from 'react';
import {useFetch} from './http';
import {Platform} from 'react-native';

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
      nowVersion(): Promise<VersionItem[]> {
        return apiGet('/now_version.json');
      },
      /** 获取版本更新记录 */
      versionLog(): Promise<VersionItem[]> {
        return apiGet('/change_log.json');
      },
    }),
    [apiGet],
  );
}

export interface VersionItem {
  platform: (typeof Platform.OS)[];
  updateLink?: string;
  versionName: string;
  versionCode: number;
  desc: string;
}
