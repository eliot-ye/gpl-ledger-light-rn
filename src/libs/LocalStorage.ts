import {AESDecrypt, AESEncrypt, MD5} from '@/utils/encoding';

export interface StorageEngine {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null | undefined>;
  removeItem: (key: string) => Promise<void>;
}

interface Option<T> {
  secretKey?: string;
  EncryptFn?: (message: string, key: string) => string;
  DecryptFn?: (message: string, key: string) => string;
  HashFn?: (message: string) => string;
  increments?: (keyof T)[];
}

export function createLocalStorage<T extends JSONConstraint>(
  initialData: T,
  engine: StorageEngine,
  option: Option<T> = {},
) {
  type Key = keyof T;

  const {
    secretKey,
    EncryptFn = AESEncrypt,
    DecryptFn = AESDecrypt,
    HashFn = MD5,
    increments = [],
  } = option;

  function getHashKey(key: Key) {
    const _key = key as string;
    if (secretKey) {
      return HashFn(_key);
    }
    return _key;
  }

  return {
    async set<K extends Key>(key: K, value: T[K]) {
      let _value = value;
      if (increments.includes(key)) {
        _value = {
          ...(await this.get(key)),
          ...value,
        };
      }
      let valueStr = JSON.stringify(_value);
      if (secretKey) {
        valueStr = EncryptFn(valueStr, secretKey);
      }
      return engine.setItem(getHashKey(key), valueStr);
    },
    async get<K extends Key>(key: K): Promise<T[K]> {
      let str = await engine.getItem(getHashKey(key));
      if (str === null || str === undefined) {
        return initialData[key];
      }
      if (secretKey) {
        str = DecryptFn(str, secretKey);
      }
      try {
        return JSON.parse(str);
      } catch (error) {
        console.error(key, error);
      }
      return str as any;
    },
    remove(key: Key) {
      return engine.removeItem(getHashKey(key));
    },
  };
}
