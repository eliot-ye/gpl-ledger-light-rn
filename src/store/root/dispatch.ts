import {createDispatch} from '@/libs/ReactContextStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayloadRoot {
  reset: undefined;
  isSignIn: boolean;
}

export default createDispatch<typeof initialState, DispatchPayloadRoot>({
  reset: () => JSON.parse(initialStateStr),

  isSignIn: (state, isSignIn) =>
    state.isSignIn === isSignIn ? state : {...state, isSignIn},
});
