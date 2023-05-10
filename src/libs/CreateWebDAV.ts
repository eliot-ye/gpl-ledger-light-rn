import {utf8ToBase64} from '@/utils/encoding';
import {XMLParser} from 'fast-xml-parser';

interface WebDAVOption {
  serverPath: string;
  account: string;
  password: string;
  utf8ToBase64?: (str: string) => string;
}

export type WebDAVException = 'ObjectNotFound' | 'IllegalArgument';
export interface WebDAVErrorResponseJson {
  'd:error'?: {
    's:exception'?: WebDAVException;
    's:message'?: string;
  };
}

const ContentTypes = {
  'text/plain': 'text/plain',
  'text/xml': 'text/xml',
  'application/json': 'application/json',
} as const;
type ContentType = keyof typeof ContentTypes;

export type WebDAVObject = ReturnType<typeof createWebDAV>;

async function fromatWebDAVResponse(response: Response) {
  const responseText = await response.text();
  return {
    headers: response.headers,
    status: response.status,
    responseText,
    responseJson: new XMLParser().parse(responseText),
  } as const;
}

export function createWebDAV(option: WebDAVOption) {
  const _utf8ToBase64 = option.utf8ToBase64 || utf8ToBase64;
  const token = _utf8ToBase64(`${option.account}:${option.password}`);
  const Authorization = `Basic ${token}`;

  function getPath(path: string) {
    return encodeURI(
      `${option.serverPath}${path}`.replace(/(?<!:)(\/\/)/g, '/'),
    );
  }

  return {
    serverPath: option.serverPath,
    account: option.account,
    password: option.account,
    async PROPFIND(path: string) {
      const response = await fetch(getPath(path), {
        method: 'PROPFIND',
        headers: {
          Authorization,
          'Content-Type': 'text/xml',
        },
        body: '<?xml version="1.0" encoding="UTF-8" ?><D:propfind xmlns:D="DAV:"><D:prop><D:getcontenttype/><D:getlastmodified/><D:getcontentlength/><D:resourcetype/></D:prop></D:propfind>',
      });
      return fromatWebDAVResponse(response);
    },

    async MKCOL(path: string) {
      const response = await fetch(getPath(path), {
        method: 'MKCOL',
        headers: {
          Authorization,
          'Content-Type': 'text/xml',
        },
      });
      return fromatWebDAVResponse(response);
    },

    async PUT(
      path: string,
      body: string,
      options = {ContentType: 'text/plain' as ContentType},
    ) {
      console.log('Authorization', Authorization);
      console.log('path', getPath(path));

      const response = await fetch(getPath(path), {
        method: 'PUT',
        headers: {
          Authorization,
          'Content-Type': ContentTypes[options.ContentType],
          // 'Content-Length': body.length.toString(),
        },
        body: encodeURIComponent(body),
      });
      return fromatWebDAVResponse(response);
    },
  } as const;
}
