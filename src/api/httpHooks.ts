import {useCallback, useEffect, useRef, useState} from 'react';

type ApiFuncParams<T> = T extends (...args: infer P) => any ? P : never;
type ApiFuncReturn<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;
interface ApiState<T> {
  loading: boolean;
  data?: ApiFuncReturn<T>;
  fetchHandle: (...args: ApiFuncParams<T>) => Promise<void>;
}

interface Option {
  autoFetch?: boolean;
}

export function useApiState<T extends Function>(
  apiFunc: T,
  apiFuncParams: ApiFuncParams<T>,
  option?: Option,
): ApiState<T> {
  type ReturnData = ApiFuncReturn<T>;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReturnData>();

  const isActive = useRef(true);

  const fetchHandle = useCallback(async (..._args: ApiFuncParams<T>) => {
    setLoading(true);
    try {
      const res = await apiFunc(..._args);
      if (!isActive.current) {
        return;
      }
      setData(res);
    } catch (e) {
      console.error(`${apiFunc.name} error:`, e);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (option?.autoFetch !== false) {
      fetchHandle(...apiFuncParams);
    }

    return () => {
      isActive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    data,
    fetchHandle,
  };
}
