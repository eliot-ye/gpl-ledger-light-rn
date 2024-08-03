import {I18n} from '@/assets/I18n';
import {CPNAlert} from '@/components/base';
import {envConstant, getFetchUrl} from '@/assets/environment';
import {ApiServerName} from '@/assets/environment/env.default';
import {SessionStorage} from '@/store/sessionStorage';
import {CusLog} from '@/utils/tools';
import {useEffect, useMemo, useRef} from 'react';

interface LogData {
  response: any;
  path: string;
  url: string;
  body: any;
  headers?: any;
}

function debug({url, response, path, body, headers}: LogData) {
  CusLog.success('url', url);
  headers && CusLog.success('Req headers', path, headers);
  CusLog.success('Req body', path, body);
  CusLog.success('Res', path, response);
}
function logError({url, response, path, body, headers}: LogData) {
  CusLog.error('url', url);
  headers && CusLog.error('Req headers', path, headers);
  CusLog.error('Req body', path, body);
  CusLog.error('Res', path, response);
}

const headersDefault = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Content-Language': I18n.getLangCode(),
  'User-Agent': envConstant.UserAgent,
  Authorization: undefined as undefined | string,
};

/**
 * @param path - 必须以 `/` 开头
 * @param body - 默认自动添加以下字段：``
 */
export function getFetchData(
  serverName: ApiServerName,
  path: string,
  body: any = {},
  option: HttpOption = {},
) {
  const optionHeaders = option.headers || {};
  const headers = {
    ...headersDefault,
    'Content-Language': I18n.getLangCode(),
    ...optionHeaders,
  };

  const autoFill = option.autoFill ?? true;
  const reqBody = autoFill
    ? {
        ...body,
      }
    : body;

  const bodyObj = {
    reqBody,
    bodyStr: '',
  };
  try {
    bodyObj.bodyStr = JSON.stringify(reqBody);
  } catch (error) {
    console.error('signature Error: ', error);
  }

  if (!__DEV__) {
    try {
      bodyObj.reqBody = null;
    } catch (error) {}
  }

  const urlData = getFetchUrl(serverName, path);

  return {
    url: `${option.domain ?? urlData.domain}${urlData.path}`,
    headers: option.hideHeader ? undefined : headers,
    bodyObj,
  };
}

async function createFetch(
  url: string,
  bodyStr: string,
  headers?: RequestHeaders,
  option: HttpOption = {},
) {
  const method = option.method ?? 'POST';

  const response = await fetch(url, {
    method,
    headers: option.hideHeader ? undefined : headers,
    body: method === 'POST' ? bodyStr : undefined,
    signal: option.signal,
  });

  const responseStatus = response.status;

  let responseData: any = '';
  try {
    if (option.dataType === DataType.json) {
      responseData = await response.json();
    }
    if (option.dataType === DataType.text) {
      responseData = await response.text();
    }
    if (option.dataType === DataType.blob) {
      responseData = await response.blob();
    }
  } catch (error) {
    CusLog.error('responseData error', url, error);
  }

  return {
    status: responseStatus,
    data: responseData,
  };
}

export enum DataType {
  json = 'json',
  text = 'text',
  blob = 'blob',
}
type FetchMethod = 'POST' | 'GET';
type RequestHeaders = Partial<typeof headersDefault>;
interface HttpOption {
  domain?: string;
  headers?: RequestHeaders;
  hideHeader?: boolean;
  /** @default true */
  autoFill?: boolean;
  /** @default true */
  showExpiredAlert?: boolean;
  /** @default true */
  showNetworkErrorAlert?: boolean;
  /** @default 'POST' */
  method?: FetchMethod;
  dataType?: DataType;
  signal?: AbortSignal;
}

const alertFlags: string[] = [];

export function createHttp(
  serverName: ApiServerName,
  serverOption: HttpOption = {},
) {
  /**
   * @param path - 必须以 `/` 开头
   * @param body - 默认自动添加以下字段：``
   */
  return async function (path: string, body?: any, option: HttpOption = {}) {
    const fetchOption: HttpOption = {
      dataType: DataType.json,
      ...serverOption,
      ...option,
    };

    const fetchData = getFetchData(serverName, path, body, fetchOption);

    try {
      const {status: responseStatus, data: responseData} = await createFetch(
        fetchData.url,
        fetchData.bodyObj.bodyStr,
        fetchData.headers,
        fetchOption,
      );

      if (__DEV__) {
        if (responseStatus === 200) {
          debug({
            path,
            response: responseData,
            ...fetchData,
            body: fetchData.bodyObj.reqBody,
          });
        } else {
          logError({
            path,
            response: responseData,
            ...fetchData,
            body: fetchData.bodyObj.reqBody,
          });
        }
      } else {
        try {
          fetchData.bodyObj.bodyStr = '';
        } catch (error) {}
      }

      if (responseStatus !== 200) {
        let errorCode = '';

        if (responseStatus === 403) {
          // token 失效
          // await LSLogout();
          SessionStorage.reset();
          if (fetchOption.showExpiredAlert ?? true) {
            errorCode = 'SessionExpired';
          }
        } else if (fetchOption.showNetworkErrorAlert ?? true) {
          errorCode = 'NetworkError';
        }

        showAlert(errorCode);

        return Promise.reject(responseStatus);
      }

      return responseData;
    } catch (error) {
      const errorObj = error as any;

      logError({
        path,
        response: errorObj,
        ...fetchData,
        body: fetchData.bodyObj.reqBody,
      });

      if (fetchOption.showNetworkErrorAlert ?? true) {
        showAlert('NetworkError');
      }

      return Promise.reject(errorObj.status);
    }
  };
}

function showAlert(alertFlag: string) {
  if (alertFlag && !alertFlags.includes(alertFlag)) {
    alertFlags.push(alertFlag);
    CPNAlert.alert('', I18n.t(alertFlag as any) || alertFlag).then(() => {
      alertFlags.splice(alertFlags.indexOf(alertFlag), 1);
    });
  }
}

/**
 * @param serverOption - ___use memoized value___
 */
export function useHttp(serverName: ApiServerName, serverOption?: HttpOption) {
  const controller = useRef(new AbortController()).current;
  useEffect(() => () => controller.abort(), [controller]);

  return useMemo(() => {
    return createHttp(serverName, {
      signal: controller.signal,
      ...serverOption,
    });
  }, [controller.signal, serverName, serverOption]);
}

export interface HttpRes<T> {
  code: number;
  msg: string;
  data: T;
}
