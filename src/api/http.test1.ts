import {useMemo} from 'react';
import {DataType, useFetch} from './http';

export function useApiTest() {
  const apiGet = useFetch(
    'test',
    useMemo(
      () => ({
        domain: 'https://v.api.aa1.cn/',
        method: 'GET',
        hideHeader: true,
        dataType: DataType.text,
      }),
      [],
    ),
  );

  return useMemo(
    () => ({
      getJoke(): Promise<string> {
        return apiGet('/yiyan/index.php');
      },
    }),
    [apiGet],
  );
}
