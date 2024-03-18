import {debounce, getOnlyStr, getValueFromStringKey} from '@/utils/tools';

interface SubscribeFn<T> {
  (state: T): void;
}
let serialNumber = 0;

export function createSubscribeState<T extends JSONConstraint>(
  initialState: T,
  mark?: string,
) {
  serialNumber++;
  const _mark = mark || `SerialNumber-${serialNumber}`;

  type StateKeys = keyof T;

  const state = {...initialState};

  type SubscribeId = string;
  const subscribeMap: {
    [id: SubscribeId]: {fn: SubscribeFn<T>; keys?: StateKeys[]} | undefined;
  } = {};
  const subscribeIds: SubscribeId[] = [];

  let effectKeys: StateKeys[] = [];
  const effectHandler = debounce(
    () => {
      subscribeIds.forEach(_id => {
        const subscribe = subscribeMap[_id];
        let hasSubscribe = false;
        if (subscribe?.keys) {
          for (const _key of effectKeys) {
            if (subscribe.keys.includes(_key)) {
              hasSubscribe = true;
            }
          }
        } else {
          hasSubscribe = true;
        }
        if (subscribe && hasSubscribe) {
          try {
            subscribe.fn(state);
          } catch (error) {
            console.error(`${_mark} subscribe (id: ${_id}) error:`, error);
          }
        }
      });
      effectKeys = [];
    },
    {wait: 0},
  );

  function get(): Readonly<T>;
  function get<K extends StateKeys>(key: K): Readonly<T[K]>;
  function get(key?: string) {
    if (key) {
      return state[key];
    }
    return state;
  }

  return {
    _interfaceType: 'SubscribeState',
    _mark,

    get,
    getFromStringKey(key: string) {
      return getValueFromStringKey(key, state);
    },

    /**
     * - 内部会对`value`进行浅层对比。相同的值，不会触发更新。
     */
    set<K extends StateKeys>(key: K, value: T[K]) {
      const oldValue = state[key];
      if (Object.is(oldValue, value)) {
        return;
      }
      state[key] = value;
      effectKeys.push(key);
      effectHandler();
    },
    setFromStringKey(key: string, value: any) {
      const oldValue = getValueFromStringKey(key, state);
      if (oldValue !== value) {
        const keyList = key.split('.');
        let dataPre: any = state;
        for (let i = 0; i < keyList.length - 1; i++) {
          dataPre = dataPre[keyList[i]];
        }
        const preKey = keyList[keyList.length - 1];
        if (Object.is(dataPre[preKey], value)) {
          return;
        }
        dataPre[preKey] = value;
        effectKeys.push(keyList[0]);
        effectHandler();
      }
    },

    /**
     * @param fn - 订阅函数
     * - 初始化时会执行一次
     * - 使用 `set` 时，内部在更新数据后才触发函数预计算，订阅函数获取的数据是最新的。
     * - 短时间内多次使用 `set` 时，会触发防抖处理，订阅函数只执行一次。
     * @param keys - 订阅属性
     * - 只有订阅的属性发生了更改才触发执行订阅函数。如果不传入该参数，则所有属性更改都会执行。
     * - 如果传入空数组，则订阅函数只执行一次，并且不会返回 `unsubscribe`
     * @returns function `unsubscribe`
     */
    subscribe<K extends StateKeys>(fn: SubscribeFn<Readonly<T>>, keys?: K[]) {
      try {
        fn(state);
      } catch (error) {
        console.error(`${_mark} subscribe error:`, error);
      }

      if (keys?.length === 0) {
        return;
      }
      const id: SubscribeId = getOnlyStr(subscribeIds);
      subscribeIds.push(id);
      subscribeMap[id] = {
        fn,
        keys,
      };

      return () => {
        subscribeMap[id] = undefined;
        subscribeIds.splice(subscribeIds.indexOf(id), 1);
      };
    },
  } as const;
}
