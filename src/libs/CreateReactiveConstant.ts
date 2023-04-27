import {getOnlyStr} from '@/utils/tools';

type JSONConstraint = Record<string, any>;
type Option<C extends string, T extends JSONConstraint> = {
  [code in C]: T;
};

interface Hook<C, T> {
  (code: C, keys: (keyof T)[]): void;
}

/** @returns 只有组件内使用时才具有反应性 */
export function CreateReactiveConstant<
  C extends string,
  T extends JSONConstraint,
>(opt: Option<C, T>) {
  const defaultActiveCode = Object.keys(opt)[0] as C;
  let activeCode = defaultActiveCode;
  const defaultValue = opt[defaultActiveCode] as T;

  type Key = keyof T;

  type ListenerId = string;
  let listenerIds: ListenerId[] = [];
  let listenerMap: {[id: ListenerId]: Hook<C, T> | undefined} = {};

  const returnValue = {
    ...defaultValue,
    setValue<K extends Key>(key: K, value: T[K]) {
      if (value !== undefined && typeof returnValue[value] !== 'function') {
        returnValue[key] = value;
        for (let i = 0; i < listenerIds.length; i++) {
          const listener = listenerMap[listenerIds[i]];
          listener && listener(activeCode, [key]);
        }
      }
    },
    setCode(code: C) {
      if (activeCode !== code) {
        activeCode = code;

        const valueMap: T = opt[activeCode];

        let changeKeys: Key[] = [];

        const keyList = Object.keys(valueMap) as Key[];
        keyList.forEach(_key => {
          const valueStr = valueMap[_key];
          if (valueStr !== undefined && returnValue[_key] !== valueStr) {
            changeKeys.push(_key);
            returnValue[_key] = valueStr;
          }
        });

        for (let i = 0; i < listenerIds.length; i++) {
          const listener = listenerMap[listenerIds[i]];
          listener && listener(activeCode, changeKeys);
        }
      }
    },
    getCode() {
      return activeCode;
    },

    /**
     * @returns `ListenerId`
     */
    addListener(hook: Hook<C, T>) {
      const id: ListenerId = getOnlyStr(listenerIds);
      listenerMap[id] = hook;
      listenerIds.push(id);
      return id;
    },
    /**
     * @param id `ListenerId`
     */
    removeListener(id: ListenerId) {
      listenerMap[id] = undefined;
      listenerIds.splice(listenerIds.indexOf(id), 1);
    },
  } as const;

  return returnValue;
}
