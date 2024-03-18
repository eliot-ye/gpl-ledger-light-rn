import {useEffect, useState} from 'react';
import {Option, createReactiveConstant} from './ReactiveConstant';

export function createReactConstant<C extends string, T extends JSONConstraint>(
  constantStrings: Option<C, T>,
) {
  type Key = keyof T;

  const RCI = createReactiveConstant(constantStrings);

  return {
    setCode: RCI.setCode,
    getCode: RCI.getCode,
    setValue: RCI.setValue,

    /** 注意：只有搭配`useCode`并在组件内使用才能获得反应性, 或者使用 `useConstant` */
    Constant: RCI.value as Readonly<T>,

    useConstant<K extends Key>(key: K) {
      const [state, stateSet] = useState(RCI.value[key]);

      useEffect(() => {
        return RCI.subscribe(_state => stateSet(_state[key]), [key]);
      }, [key]);

      return state;
    },

    useCode() {
      const [code, codeSet] = useState(RCI.getCode());

      useEffect(() => {
        return RCI.addListener('changeCode', _code => codeSet(_code));
      }, []);

      return code;
    },
  };
}
