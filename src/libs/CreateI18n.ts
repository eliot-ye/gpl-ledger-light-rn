import {getOnlyStr} from '@/utils/tools';
import React from 'react';

type JSONConstraint = Record<string, any>;
type Option<C extends string, T extends JSONConstraint> = {
  [code in C]: T;
};

interface Hook<C, T> {
  (code: C, keys: (keyof T)[]): void;
}

type Formatted = string | number | JSX.Element;
type FormatObject<U extends Formatted> = {
  [key: string]: U;
};

const placeholderRegex = /(\{[\d|\w]+\})/;
const I18n = {
  create<C extends string, T extends JSONConstraint>(opt: Option<C, T>) {
    const defaultActive = Object.keys(opt)[0] as C;
    let active = defaultActive;
    const defaultValue = opt[defaultActive];

    type Key = keyof T;
    const keyList = Object.keys(defaultValue) as Key[];

    type ListenerId = string;
    let listenerIds: ListenerId[] = [];
    let listenerMap: {[id: string]: Hook<C, T> | undefined} = {};

    const returnValue = {
      ...defaultValue,
      setCode(code: C) {
        active = code;
        const valueMap = opt[active];

        let changeKeys: Key[] = [];

        keyList.forEach(_key => {
          const valueStr = valueMap[_key];
          if (valueStr !== undefined && valueStr !== returnValue[_key]) {
            changeKeys.push(_key);
            returnValue[_key] = valueStr;
          }
        });

        for (let i = 0; i < listenerIds.length; i++) {
          const listener = listenerMap[listenerIds[i]];
          listener && listener(active, changeKeys);
        }
      },
      getCode() {
        return active;
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
    };

    return returnValue;
  },

  formatString<T extends Formatted>(
    str: string,
    ...values: Array<T | FormatObject<T>>
  ) {
    const _len = values.length;
    let valuesForPlaceholders = Array(_len);
    for (let _key = 0; _key < _len; _key++) {
      valuesForPlaceholders[_key] = values[_key];
    }

    if (!str) {
      return '';
    }

    return str.replace(/{(.*?)}/g, (match, key: string) => {
      const numKey = Number(key);
      if (Number.isNaN(numKey)) {
        return valuesForPlaceholders[0][key] || match;
      }
      return valuesForPlaceholders[numKey] || match;
    });
  },

  formatReactText<T extends Formatted>(
    str: string,
    ...values: Array<T | FormatObject<T>>
  ) {
    const _len = values.length;
    let valuesForPlaceholders = Array(_len);
    for (let _key = 0; _key < _len; _key++) {
      valuesForPlaceholders[_key] = values[_key];
    }

    let hasObject = false;
    const res = (str || '')
      .split(placeholderRegex)
      .filter(textPart => !!textPart)
      .map((textPart, index) => {
        if (textPart.match(placeholderRegex)) {
          const matchedKey = textPart.slice(1, -1);
          let valueForPlaceholder = valuesForPlaceholders[Number(matchedKey)];

          // If no value found, check if working with an object instead
          if (valueForPlaceholder === undefined) {
            const valueFromObjectPlaceholder =
              valuesForPlaceholders[0][matchedKey];
            if (valueFromObjectPlaceholder !== undefined) {
              valueForPlaceholder = valueFromObjectPlaceholder;
            } else {
              // If value still isn't found, then it must have been undefined/null
              return valueForPlaceholder;
            }
          }

          if (React.isValidElement(valueForPlaceholder)) {
            hasObject = true;
            return React.Children.toArray(valueForPlaceholder).map(component =>
              Object.assign({}, component, {key: index.toString()}),
            );
          }

          return valueForPlaceholder;
        }
        return textPart;
      });
    // If the results contains a object return an array otherwise return a string
    if (hasObject) {
      return res as React.ReactNode;
    }
    return res.join('');
  },
};
export default I18n;
