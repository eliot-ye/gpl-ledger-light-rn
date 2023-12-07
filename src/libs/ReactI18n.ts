import React, {useEffect, useState} from 'react';
import {Option, createReactiveConstant} from './ReactiveConstant';

interface I18nOption<C> {
  defaultLang: C;
}

type InferKeyArray<T> = T extends `${string}{${infer K}}${infer R}`
  ? [K, ...InferKeyArray<R>]
  : [];
/**
 * 获取字符串`{key}`结构中的key值
 * @example
 * type D = InferKey<'abc{d}efg'>
 * // type D = 'd'
 * */
type InferKey<T> = InferKeyArray<T> extends Array<infer K extends string>
  ? K
  : T;
type Formatted = string | number | JSX.Element;
type KeyConstraint<K extends string, V> = Record<K, V>;
type FormatReturn<V, L> = V extends JSX.Element ? V : L;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  value: KeyConstraint<InferKey<L>, V>,
): FormatReturn<V, L>;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  ...values: V[]
): FormatReturn<V, L>;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  ...values: V[]
): FormatReturn<V, L> {
  const _len = values.length;
  let valuesForPlaceholders = Array(_len);
  for (let _key = 0; _key < _len; _key++) {
    valuesForPlaceholders[_key] = values[_key];
  }

  const placeholderRegex = /(\{[\d|\w]+\})/;

  let hasObject = false;
  const res = ((langString as string) || '')
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
    return res as any;
  }
  return res.join('') as any;
}

export function createReactI18n<C extends string, T extends JSONConstraint>(
  langStrings: Option<C, T>,
  option?: I18nOption<C>,
) {
  const RCI = createReactiveConstant(langStrings);

  const RCIDefaultLang = RCI.$getCode();
  const defaultLang = option?.defaultLang || RCIDefaultLang;
  if (RCIDefaultLang !== defaultLang) {
    RCI.$setCode(defaultLang);
  }

  function translate<K extends keyof T>(key: K): T[K];
  function translate<K extends keyof T, L extends T[K], V extends Formatted>(
    key: K,
    value: KeyConstraint<InferKey<L>, V>,
  ): FormatReturn<V, L>;
  function translate<K extends keyof T, L extends T[K], V extends Formatted>(
    key: K,
    ...values: V[]
  ): FormatReturn<V, L>;
  function translate<K extends keyof T, L extends T[K], V extends Formatted>(
    key: K,
    ...values: V[]
  ): FormatReturn<V, L> {
    if (values.length) {
      return formatReactNode(RCI[key], ...values);
    }
    return RCI[key];
  }

  return {
    t: translate,
    f: formatReactNode,

    setLangCode: RCI.$setCode,
    getLangCode: RCI.$getCode,

    useLocal() {
      const [langCode, langCodeSet] = useState(defaultLang);

      useEffect(() => {
        const _id = RCI.$addListenerCode(_lang => {
          langCodeSet(_lang);
        });

        return () => {
          RCI.$removeListenerCode(_id);
        };
      }, []);

      return {
        langCode,
      };
    },
  };
}
