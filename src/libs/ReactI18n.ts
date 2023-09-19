import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
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
type KeyConstraint<K extends string, V extends Formatted> = Record<K, V>;
type FormatReturn<V> = V extends JSX.Element ? V : string;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  value: KeyConstraint<InferKey<L>, V>,
): FormatReturn<V>;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  ...values: V[]
): FormatReturn<V>;
export function formatReactNode<L extends string, V extends Formatted>(
  langString: L,
  ...values: V[]
): FormatReturn<V> {
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

  const LangContext = createContext(defaultLang);

  function translate<K extends keyof T>(key: K): T[K];
  function translate<K extends keyof T, V extends Formatted>(
    key: K,
    value: KeyConstraint<InferKey<T[K]>, V>,
  ): FormatReturn<V>;
  function translate<K extends keyof T, V extends Formatted>(
    key: K,
    ...values: V[]
  ): FormatReturn<V>;
  function translate<K extends keyof T, V extends Formatted>(
    key: K,
    ...values: V[]
  ): FormatReturn<V> {
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
      const langCode = useContext(LangContext);
      return {
        langCode,
      };
    },

    Provider(props: PropsWithChildren) {
      const [langCode, langCodeSet] = useState(defaultLang);

      useEffect(() => {
        const _id = RCI.$addListenerCode(_lang => {
          langCodeSet(_lang);
        });

        return () => {
          RCI.$removeListener(_id);
        };
      }, []);

      return React.createElement(
        LangContext.Provider,
        {value: langCode},
        props.children,
      );
    },
  };
}
