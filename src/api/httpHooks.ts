import {useCallback, useEffect, useState} from 'react';

type ApiFuncParams<T> = T extends (...args: infer P) => any ? P : never;
type ApiFuncReturn<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

export function useApiState<T extends Function>(
  apiFunc: T,
  apiFuncParams: ApiFuncParams<T>,
  option: {autoFetch?: boolean} = {autoFetch: true},
) {
  type Return = ApiFuncReturn<T>;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Return>();

  const fetchData = useCallback(async (..._args: ApiFuncParams<T>) => {
    setLoading(true);
    try {
      const res = await apiFunc(..._args);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (option.autoFetch) {
      fetchData(...apiFuncParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return {
    loading,
    data,
    fetchData: fetchData,
  };
}
