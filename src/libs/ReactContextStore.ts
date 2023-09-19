import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

type DispatchAggregate<InitialState, DispatchPayload> = {
  [K in keyof DispatchPayload]: (
    state: InitialState,
    payload: Pick<DispatchPayload, K>[K],
  ) => InitialState;
};
export function createDispatch<
  InitialState extends JSONConstraint,
  DispatchPayload extends JSONConstraint,
>(dispatchOptions: DispatchAggregate<InitialState, DispatchPayload>) {
  return dispatchOptions;
}

let storeCount = 0;
export function createStore<
  InitialState extends JSONConstraint,
  DispatchPayload extends JSONConstraint,
>(
  initialState: InitialState,
  dispatchAggregate: DispatchAggregate<InitialState, DispatchPayload>,
  name?: string,
) {
  storeCount++;
  const storeName = name || `Store-${storeCount}`;

  type DispatchKey = keyof DispatchPayload;

  /** 注意：不可在组件顶层使用 */
  function initDispatch<
    K extends keyof ExtractValues<DispatchPayload, undefined>,
  >(type: K): void;
  function initDispatch<K extends DispatchKey>(
    type: K,
    payload: Pick<DispatchPayload, K>[K],
  ): void;
  function initDispatch<K extends DispatchKey>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type: K,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    payload?: Pick<DispatchPayload, K>[K],
  ) {}

  const DispatchContext = createContext(initDispatch);
  const StateContext = createContext(initialState);

  function reducer<K extends DispatchKey>(
    state: InitialState,
    action: {type: DispatchKey; payload: Pick<DispatchPayload, K>[K]},
  ) {
    const dispatch = dispatchAggregate[action.type];

    if (!dispatch) {
      console.error(
        `${storeName} dispatch "${String(action.type)}" is undefined`,
      );
      return state;
    }

    return dispatch(state, action.payload);
  }

  return {
    name: storeName,
    StateContext,
    DispatchContext,
    useState() {
      return useContext(StateContext);
    },
    useDispatch() {
      return useContext(DispatchContext);
    },
    Provider(props: PropsWithChildren) {
      const [state, dispatchHandle] = useReducer(reducer, initialState);

      const dispatchValue = useMemo(
        () => (type: any, payload?: any) => dispatchHandle({type, payload}),
        [],
      );

      return React.createElement(
        DispatchContext.Provider,
        {value: dispatchValue},
        React.createElement(
          StateContext.Provider,
          {value: state},
          props.children,
        ),
      );
    },
  };
}
