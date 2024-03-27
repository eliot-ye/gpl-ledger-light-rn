import {useEffect, useState} from 'react';
import {Option, createReactiveConstant} from './ReactiveConstant';
import {JSONConstraint} from 'types/global';

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
    Constant: RCI.value,

    useConstant<K extends Key>(key: K) {
      const [state, setState] = useState(RCI.value[key]);

      useEffect(() => {
        return RCI.subscribe(_state => setState(_state[key]), [key]);
      }, [key]);

      return state;
    },

    useCode() {
      const [code, setCode] = useState(RCI.getCode());

      useEffect(() => {
        return RCI.addListener('changeCode', _code => setCode(_code));
      }, []);

      return code;
    },
  };
}
