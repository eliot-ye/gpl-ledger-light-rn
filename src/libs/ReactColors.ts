import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Option, createReactiveConstant} from './ReactiveConstant';

export function createReactColors<C extends string, T extends JSONConstraint>(
  langStrings: Option<C, T>,
) {
  const RCI = createReactiveConstant(langStrings);

  const RCIDefaultCode = RCI.$getCode();

  const CodeContext = createContext(RCIDefaultCode);

  type V1 = ExcludedKey<T, `$${string}`>;
  type V2 = ExcludedKey<V1, `_${string}`>;

  return {
    setTheme: RCI.$setCode,
    getTheme: RCI.$getCode,

    /** 只有组件内使用时才具有反应性 */
    Colors: RCI as V2,

    useTheme() {
      const code = useContext(CodeContext);
      return {
        theme: code,
      };
    },

    Provider(props: PropsWithChildren) {
      const [code, codeSet] = useState(RCIDefaultCode);

      useEffect(() => {
        const _id = RCI.$addListenerCode(_code => {
          codeSet(_code);
        });

        return () => {
          RCI.$removeListenerCode(_id);
        };
      }, []);

      return React.createElement(
        CodeContext.Provider,
        {value: code},
        props.children,
      );
    },
  };
}
