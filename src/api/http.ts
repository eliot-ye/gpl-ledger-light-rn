import {I18n, langDefault} from '@/assets/I18n';
import {CPNAlert} from '@/components/base';
import {envConstant, getFetchUrl} from '@/configs/env';
import {ApiServerName} from '@/configs/env.default';
import {Store} from '@/store';
import {CusLog} from '@/utils/tools';
import {useCallback} from 'react';
import {Platform} from 'react-native';

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
  'User-Agent': `${envConstant.brand}/(${envConstant.model}) ${Platform.OS}/${Platform.Version} ${envConstant.bundleId}/${envConstant.versionName}.${envConstant.versionCode}`,
  'Content-Language': langDefault,
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

  const autoFill = option.autoFill === undefined ? true : option.autoFill;
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
    url: `${option.domain || urlData.domain}${urlData.path}`,
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
  const method = option.method || 'POST';
  console.log('url', url);
  console.log('method', method);
  console.log('headers', option.hideHeader ? undefined : headers);
  console.log('body', method === 'POST' ? bodyStr : undefined);

  return fetch(url, {
    method,
    headers: option.hideHeader ? undefined : headers,
    body: method === 'POST' ? bodyStr : undefined,
  });
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
  /** @default 'POST' */
  method?: FetchMethod;
  dataType?: DataType;
}

let showExpiredFlag = false;
let showNetworkErrorFlag = false;

const serverOptionDefault = {};
/**
 * @param serverOption - ___use memoized value___
 */
export function useFetch(
  serverName: ApiServerName,
  serverOption: HttpOption = serverOptionDefault,
) {
  return useCallback(
    /**
     * @param path - 必须以 `/` 开头
     * @param body - 默认自动添加以下字段：``
     */
    async function (path: string, body?: any, option: HttpOption = {}) {
      const fetchOption: HttpOption = {
        dataType: DataType.json,
        ...serverOption,
        ...option,
      };

      const fetchData = getFetchData(serverName, path, body, fetchOption);

      try {
        const response = await createFetch(
          fetchData.url,
          fetchData.bodyObj.bodyStr,
          fetchData.headers,
          fetchOption,
        );

        const responseStatus = response.status;

        let responseData: any = '';
        try {
          if (fetchOption.dataType === DataType.json) {
            responseData = await response.json();
          }
          if (fetchOption.dataType === DataType.text) {
            responseData = await response.text();
          }
          if (fetchOption.dataType === DataType.blob) {
            responseData = await response.blob();
          }
        } catch (error) {
          CusLog.error('responseData error', fetchData.url, error);
        }

        if (!__DEV__) {
          try {
            fetchData.bodyObj.bodyStr = '';
          } catch (error) {}
        } else {
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
        }

        if (responseStatus !== 200) {
          const showExpiredAlert =
            fetchOption.showExpiredAlert === undefined
              ? true
              : fetchOption.showExpiredAlert;
          if (responseStatus === 403 && !showExpiredFlag && showExpiredAlert) {
            // token 失效
            showExpiredFlag = true;
            // await LSLogout();
            Store.reset();
            CPNAlert.alert('', I18n.t('SessionExpired')).then(() => {
              showExpiredFlag = false;
            });
          }

          if (responseStatus !== 403 && !showNetworkErrorFlag) {
            showNetworkErrorFlag = true;
            CPNAlert.alert('', I18n.t('NetworkError')).then(() => {
              showNetworkErrorFlag = false;
            });
          }

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

        return Promise.reject(errorObj.status);
      }
    },
    [serverName, serverOption],
  );
}

// export function useLogout() {
//   const resetStore = useResetStore();

//   return useCallback(
//     async function () {
//       const fetchData = getFetchData('main', '/logout');

//       createFetch(fetchData.url, fetchData.bodyObj.bodyStr, fetchData.headers)
//         .then(res => {
//           CusLog.success('res logout:', fetchData.url, res);
//         })
//         .catch(error => {
//           CusLog.error('err logout:', fetchData.url, error);
//         });

//       await LSLogout();
//       resetStore();
//     },
//     [resetStore],
//   );
// }

export interface HttpRes {
  code: number;
  msg: string;
}
