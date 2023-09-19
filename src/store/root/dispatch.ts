import {Colors, ThemeCode} from '@/configs/colors';
import {createDispatch} from '@/libs/ReactContextStore';
import initialState from './initialState';

const initialStateStr = JSON.stringify(initialState);

interface DispatchPayloadRoot {
  reset: undefined;
  theme: ThemeCode;
  isSignIn: boolean;
}

export default createDispatch<typeof initialState, DispatchPayloadRoot>({
  reset: () => JSON.parse(initialStateStr),

  theme: (state, theme) => {
    if (theme === state.theme) {
      return state;
    }
    Colors.$setCode(theme);
    return {...state, theme};
  },

  isSignIn: (state, isSignIn) =>
    state.isSignIn === isSignIn ? state : {...state, isSignIn},
});
