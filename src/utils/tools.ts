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

export function generateUUID(comparative?: string[]) {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      // eslint-disable-next-line no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // eslint-disable-next-line no-bitwise
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  if (comparative && comparative.includes(uuid)) {
    return generateUUID(comparative);
  }
  return uuid;
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
  const resultList = RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i').exec(
    url.split('?')[1],
  );
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
     * - immediate=true 调用函数体时，callback 被立即调用，并锁定不能再调用。函数体会从上一次被调用后，倒计时 wait 毫秒后解锁可调用 callback。
     * - immediate=false 函数体会从上一次被调用后，延迟 wait 毫秒后调用 callback；
     * @default false
     * */
    immediate?: boolean;
  } = {},
): (...args: T) => void {
  let timer: any = null;
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

export const dateFns = {
  isInvalidDate(date: Date) {
    return isNaN(date.getTime());
  },

  ERROR: {
    INVALID_DATE: 'dateTime is invalid',
  } as const,

  /**
   * 格式化日期
   * @param dateTime - 日期时间，参数需要满足 new Date() 传入参数要求
   * @param format - 格式化字符串
   * - 默认格式： `yyyy-MM-dd HH:mm:ss`
   */
  format(dateTime: string | number | Date, format = 'yyyy-MM-dd HH:mm:ss') {
    let date = new Date(dateTime);
    if (dateFns.isInvalidDate(date)) {
      if (typeof dateTime === 'string') {
        date = new Date(dateTime.replace(/-/g, '/'));
        if (dateFns.isInvalidDate(date)) {
          throw new Error(dateFns.ERROR.INVALID_DATE);
        }
      }
    }

    const TZO = date.getTimezoneOffset() / 60;

    const formatConfigs: Record<string, string> = {
      yyyy: date.getFullYear().toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, '0'),
      dd: date.getDate().toString().padStart(2, '0'),
      HH: date.getHours().toString().padStart(2, '0'),
      mm: date.getMinutes().toString().padStart(2, '0'),
      ss: date.getSeconds().toString().padStart(2, '0'),
      TZ: TZO > 0 ? '-' + TZO : '+' + -TZO,
    };

    return format.replace(
      new RegExp(Object.keys(formatConfigs).join('|'), 'g'),
      (matched: string) => formatConfigs[matched] ?? matched,
    );
  },
};

export const numberFns = {
  /**
   * 格式化数字，每千位添加逗号
   */
  format(num: number | string): string {
    return String(num).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  },
  /**
   * 将字符串转为数字
   */
  recover(numStr: string): number {
    return Number(numStr.replace(/,/g, ''));
  },
};

export const cardNumberFns = {
  /**
   * 格式化卡号，每四位加 -
   */
  format(cardNumber: number | string): string {
    return String(cardNumber).replace(/(\w{4})(?=\w)/g, '$1 - ');
  },
  /**
   * 恢复为卡号
   */
  recover(cardNumberStr: string) {
    return cardNumberStr.replace(/ - /g, '');
  },
};

export function colorGetBackground(colorStr: string, ratio = 0.2) {
  return ColorProcessor(colorStr).alpha(ratio).toString();
}
