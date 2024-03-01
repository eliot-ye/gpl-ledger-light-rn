import {MD5} from './encoding';
import ColorProcessor from 'color';

export function logNameValueBase(
  color: string,
  name: string | number = '',
  value: string | number = '',
  ...orderValue: any[]
) {
  if (__DEV__) {
    console.log(
      `%c ${name} %c ${value} %c`,
      'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      `background: ${color}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
      'background: transparent',
      ...orderValue,
    );
  }
}
export const CusLog = {
  success(
    name?: string | number,
    value?: string | number,
    ...orderValue: any[]
  ) {
    logNameValueBase('#41b883', name, value, ...orderValue);
  },
  error(name?: string | number, value?: string | number, ...orderValue: any[]) {
    logNameValueBase('red', name, value, ...orderValue);
  },
};

/** 获取一个随机6位字符串加时间戳的字符串，格式为 `{randomString}:{timestamp}` */
export function getRandomStr() {
  return `${Math.random().toString(36).slice(-8)}:${new Date().getTime()}`;
}

/** 获取 `getRandomStr` 字符串的MD5 */
export function getRandomStrMD5() {
  return MD5(getRandomStr());
}

/**
 * 获取一个不属于 comparative 的随机字符串
 * @param comparative - 需要排除的字符串集合
 * @param length - 字符串长度，默认长度：8
 * */
export function getOnlyStr(comparative: string[], length = 8): string {
  const str = Math.random().toString(36).slice(-length);
  if (comparative.includes(str)) {
    return getOnlyStr(comparative, length);
  }
  return str;
}

/** 获取 [n,m] 范围内的随机整数 */
export function getRandomInteger(n: number, m: number) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

/**
 * 提取 url 的 query
 * @param url 需要提取的 url
 * @param key query 的 key
 */
export function getUrlQuery(url: string, key: string) {
  if (!url.includes('?')) {
    return undefined;
  }
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
  const resultList = url.split('?')[1].match(reg);
  return resultList ? decodeURIComponent(resultList[2]) : undefined;
}

/**
 * 防抖函数
 * @return - 防抖函数体
 */
export function debounce<T extends Array<any>>(
  callback: (...args: T) => void,
  option: {
    /**
     * 延迟毫秒数
     * @default 500
     * */
    wait?: number;
    /**
     * - immediate=true 多次间隔不超过 wait 时长调用函数体时，第一次调用函数体立即调用 callback 并锁定至最后一次调用函数体 wait 时长；
     * - immediate=false 多次间隔不超过 wait 时长调用函数体时，最后一次调用函数体 wait 时长后调用 callback
     * @default false
     * */
    immediate?: boolean;
  } = {},
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null;
  const {wait = 500, immediate = false} = option;
  return (...args: T) => {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      if (!timer) {
        callback(...args);
      }
      timer = setTimeout(() => (timer = null), wait);
    } else {
      timer = setTimeout(() => {
        timer = null;
        callback(...args);
      }, wait);
    }
  };
}

/**
 * 节流函数。函数体在 wait 毫秒内多次调用，callback 只触发一次
 * @return - 节流函数体
 */
export function throttle<T extends Array<any>>(
  callback: (...args: T) => void,
  /**
   * 间隔时间，单位：毫秒
   * @default 500
   * */
  wait: number = 500,
): (...args: T) => void {
  let startTime = 0;
  return (...args: T) => {
    const now = +new Date();
    if (now - startTime >= wait) {
      startTime = now;
      callback(...args);
    }
  };
}

export function getValueFromStringKey(strKey: string, objState: any) {
  const keyList = strKey.split('.');
  let data = objState;
  for (const key of keyList) {
    data = data[key];
  }
  return data;
}

/** 字符串首字母大写，其余都小写 */
export function toTitleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

/** 字符串的每个单词首字母都大写，其余部分小写 */
export function toEachTitleUpperCase(str: string) {
  let newStr = str.split(' ');
  for (let i = 0; i < newStr.length; i++) {
    newStr[i] =
      newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
  }
  return newStr.join(' ');
}

export function colorGetBackground(colorStr: string, ratio = 0.2) {
  return ColorProcessor(colorStr).alpha(ratio).toString();
}
