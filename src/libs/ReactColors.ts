import {useEffect, useState} from 'react';
import {Option, createReactiveConstant} from './ReactiveConstant';

export function createReactColors<C extends string, T extends JSONConstraint>(
  langStrings: Option<C, T>,
) {
  const RCI = createReactiveConstant(langStrings);

  return {
    setTheme: RCI.$setCode,
    getTheme: RCI.$getCode,

    /** 注意：只有搭配`useTheme`并在组件内使用才能获得反应性 */
    Colors: RCI as T,

    useTheme() {
      const [code, codeSet] = useState(RCI.$getCode());

      useEffect(() => {
        return RCI.$addListener('changeCode', _code => codeSet(_code));
      }, []);

      return {
        theme: code,
      };
    },
  };
}
